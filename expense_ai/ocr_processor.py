#!/usr/bin/env python3
"""
OCR Processor using Google Gemini AI
Tích hợp từ Cong-Nghe-OCR-Quet-Hoa-Don
"""
import os
import base64
import requests
from datetime import datetime
import re

class GeminiOCRProcessor:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('GEMINI_API_KEY', 'AIzaSyBF7jxAXLiAQhmR8UzFBPT9tTcNmQGihhw')
        self.api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={self.api_key}"
    
    def extract_receipt_data(self, image_path):
        """
        Trích xuất thông tin từ hóa đơn sử dụng Gemini AI
        """
        try:
            # Đọc và encode image
            with open(image_path, 'rb') as f:
                image_data = base64.b64encode(f.read()).decode('utf-8')
            
            # Tạo prompt cho Gemini
            prompt = """Bạn là một trợ lý kế toán chuyên nghiệp. Phân tích hình ảnh hóa đơn và trích xuất các thông tin sau vào một đối tượng JSON.

Các trường cần trích xuất:
- storeName: Tên cửa hàng/nhà hàng
- date: Ngày hóa đơn (định dạng YYYY-MM-DD)
- total: Tổng số tiền (chỉ lấy số, không có đơn vị)
- items: Một mảng các sản phẩm. Mỗi sản phẩm có: name (tên), quantity (số lượng), price (giá)
- category: Phân loại chi tiêu (an uong, di lai, hoc tap, giai tri, hoa don, khac)

Nếu không tìm thấy thông tin, hãy để giá trị rỗng ("") hoặc 0."""

            # Tạo payload
            payload = {
                "contents": [{
                    "role": "user",
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": "image/jpeg",
                                "data": image_data
                            }
                        }
                    ]
                }],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "responseSchema": {
                        "type": "OBJECT",
                        "properties": {
                            "storeName": {"type": "STRING"},
                            "date": {"type": "STRING"},
                            "total": {"type": "NUMBER"},
                            "items": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "name": {"type": "STRING"},
                                        "quantity": {"type": "NUMBER"},
                                        "price": {"type": "NUMBER"}
                                    }
                                }
                            },
                            "category": {"type": "STRING"}
                        }
                    }
                }
            }
            
            # Gọi API
            response = requests.post(
                self.api_url,
                headers={'Content-Type': 'application/json'},
                json=payload,
                timeout=30
            )
            
            if response.status_code != 200:
                return {
                    'success': False,
                    'error': f'API error: {response.status_code}'
                }
            
            result = response.json()
            
            # Parse kết quả
            json_string = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '{}')
            
            import json
            receipt_data = json.loads(json_string)
            
            # Format lại dữ liệu
            return {
                'success': True,
                'total_amount': receipt_data.get('total', 0),
                'description': receipt_data.get('storeName', 'Chi tiêu từ hóa đơn'),
                'category': self._map_category(receipt_data.get('category', 'khac')),
                'merchant_info': {
                    'name': receipt_data.get('storeName', ''),
                    'date': receipt_data.get('date', datetime.now().strftime('%Y-%m-%d'))
                },
                'items': receipt_data.get('items', []),
                'raw_text': f"Store: {receipt_data.get('storeName', '')}\nDate: {receipt_data.get('date', '')}\nTotal: {receipt_data.get('total', 0)}",
                'validation': {
                    'has_total': bool(receipt_data.get('total')),
                    'has_date': bool(receipt_data.get('date')),
                    'has_merchant': bool(receipt_data.get('storeName'))
                },
                'auto_classified': True,
                'confidence_score': 0.85
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def _map_category(self, category):
        """Map category từ Gemini về system categories"""
        category_mapping = {
            'an uong': 'an uong',
            'di lai': 'di lai',
            'hoc tap': 'hoc tap',
            'giai tri': 'giai tri',
            'hoa don': 'hoa don',
            'khac': 'khac'
        }
        return category_mapping.get(category.lower(), 'khac')

# Singleton instance
gemini_ocr_processor = GeminiOCRProcessor()

if __name__ == "__main__":
    # Test
    processor = GeminiOCRProcessor()
    result = processor.extract_receipt_data("test_receipt.jpg")
    print(result)