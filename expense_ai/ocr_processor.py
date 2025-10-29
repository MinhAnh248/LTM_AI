import base64
import json
import requests
import os
from datetime import datetime

class OCRProcessor:
    def __init__(self):
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        if not self.gemini_api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
    
    def process_receipt(self, image_file):
        """
        Process receipt image using Gemini AI OCR
        Returns structured receipt data
        """
        try:
            # Convert image to base64
            image_data = base64.b64encode(image_file.read()).decode('utf-8')
            
            # Prepare Gemini API request
            prompt = """Bạn là một trợ lý kế toán chuyên nghiệp. Phân tích văn bản hóa đơn sau và trích xuất các thông tin sau vào một đối tượng JSON.
            
            Các trường cần trích xuất:
            - storeName: Tên cửa hàng
            - date: Ngày hóa đơn (định dạng YYYY-MM-DD)
            - total: Tổng số tiền (chỉ lấy số, không có đơn vị, ví dụ: 537000)
            - items: Một mảng các sản phẩm. Mỗi sản phẩm có: name (tên), quantity (số lượng), price (giá).
            
            Nếu không tìm thấy thông tin, hãy để giá trị rỗng ("") hoặc 0."""
            
            payload = {
                'contents': [{
                    'role': 'user',
                    'parts': [
                        {'text': prompt},
                        {'inline_data': {'mime_type': 'image/jpeg', 'data': image_data}}
                    ]
                }],
                'generationConfig': {
                    'responseMimeType': 'application/json',
                    'responseSchema': {
                        'type': 'OBJECT',
                        'properties': {
                            'storeName': {'type': 'STRING'},
                            'date': {'type': 'STRING'},
                            'total': {'type': 'NUMBER'},
                            'items': {
                                'type': 'ARRAY',
                                'items': {
                                    'type': 'OBJECT',
                                    'properties': {
                                        'name': {'type': 'STRING'},
                                        'quantity': {'type': 'NUMBER'},
                                        'price': {'type': 'NUMBER'}
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            # Call Gemini API
            url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={self.gemini_api_key}'
            response = requests.post(url, json=payload, timeout=30)
            
            if response.status_code != 200:
                raise Exception(f"Gemini API error: {response.status_code}")
            
            result = response.json()
            receipt_data = json.loads(result['candidates'][0]['content']['parts'][0]['text'])
            
            return {
                'success': True,
                'data': {
                    'amount': receipt_data.get('total', 0),
                    'description': receipt_data.get('storeName', 'Hóa đơn'),
                    'category': self._predict_category(receipt_data.get('storeName', '')),
                    'date': receipt_data.get('date', datetime.now().strftime('%Y-%m-%d')),
                    'items': receipt_data.get('items', [])
                },
                'raw_data': receipt_data
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'data': {
                    'amount': 0,
                    'description': 'Hóa đơn',
                    'category': 'khac',
                    'date': datetime.now().strftime('%Y-%m-%d'),
                    'items': []
                }
            }
    
    def _predict_category(self, store_name):
        """Simple category prediction based on store name"""
        store_name = store_name.lower()
        
        if any(word in store_name for word in ['cafe', 'coffee', 'highland', 'starbucks', 'phuc long', 'cong ca phe']):
            return 'an uong'
        elif any(word in store_name for word in ['grab', 'gojek', 'be', 'taxi']):
            return 'di lai'
        elif any(word in store_name for word in ['fahasa', 'nha sach', 'book', 'truong']):
            return 'hoc tap'
        elif any(word in store_name for word in ['cgv', 'lotte', 'galaxy', 'cinema']):
            return 'giai tri'
        elif any(word in store_name for word in ['evn', 'sawaco', 'viettel', 'mobifone', 'vinaphone']):
            return 'hoa don'
        else:
            return 'khac'