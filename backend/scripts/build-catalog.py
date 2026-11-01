"""Build a reproducible seed from reviewed manufacturer evidence. No DB writes."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / 'docs/catalog-import'
OUT = ROOT / 'backend/seed-data'
SEIKO = ['SRPD55', 'SRPD51', 'SRPD53', 'SRPD59', 'SSK001', 'SSK003', 'SSK023', 'SSK033', 'SRPG35', 'SRPJ85']
TISSOT = ['T1374101104100', 'T1374101105100', 'T1374101103100', 'T1374071104100', 'T1374071105100',
          'T1372101104100', 'T1372101103100', 'T1372071104100', 'T0064071103300', 'T1274071104100']
COLORS = {'SRPD55': 'Đen', 'SRPD51': 'Xanh dương', 'SRPD53': 'Xanh dương', 'SRPD59': 'Cam',
          'SSK001': 'Đen', 'SSK003': 'Xanh dương', 'SSK023': 'Đen', 'SSK033': 'Trắng',
          'SRPG35': 'Đen', 'SRPJ85': 'Đen'}
TRANSLATE = {'Stainless steel': 'Thép không gỉ', '316L stainless steel': 'Thép không gỉ 316L',
             'Sapphire': 'Sapphire', 'Sapphire with one antireflective coating on bottom side': 'Sapphire phủ chống phản xạ mặt trong',
             'Hardlex': 'Hardlex', 'Curved Hardlex': 'Hardlex cong', 'Hardlex with magnified glass': 'Hardlex có kính phóng đại lịch',
             'Blue': 'Xanh dương', 'Black': 'Đen', 'Silver': 'Bạc', 'White': 'Trắng', 'Nylon': 'Nylon'}


def load(code):
    page = json.loads((SOURCES / f'{code}.json').read_text(encoding='utf-8'))
    assert code in page['meta'].get('og:title', ''), f'Not a product page: {code}'
    return page


def value(text, key):
    assert key in text, f'Missing specification: {key}'
    return text[text.index(key) + 1]


def translate(text):
    return TRANSLATE.get(text, text)


def product(code, brand, title, price, specs, source, image, categories):
    slug = f'dong-ho-{brand.lower()}-{code.lower()}'
    description = (
        f'<h2>{title} {code}</h2><p>Mẫu {brand} với mặt {specs["dial_color"].lower()}, '
        f'kích thước {specs["case_size"]}, dây {specs["strap_material"].lower()}. '
        f'Trang bị {specs["movement"]}, kính {specs["glass"]} và mức chống nước {specs["water_resistance"]}.</p>'
        f'<h3>Đặc điểm</h3><p>{specs["functions"]}.</p>'
        '<h3>Sử dụng và bảo quản</h3><p>Tránh chỉnh núm hoặc bấm nút khi đồng hồ đang ướt. '
        'Không dùng trong nước nóng, phòng xông hơi hoặc tiếp xúc hóa chất. '
        'Tham khảo hướng dẫn của hãng cho hoạt động dưới nước phù hợp.</p>'
        f'<p>Thông số đối chiếu từ <a href="{source}" target="_blank" rel="noopener noreferrer">website hãng</a>. '
        'Giá bán, tồn kho và bảo hành cửa hàng là dữ liệu khởi tạo cho đồ án, không phải báo giá của hãng.</p>'
    )
    return dict(sku=code, brand=brand, name=f'Đồng hồ {title} {code}', slug=slug, price=price,
                stock=12, warranty_months=24, description=description, specifications=specs,
                source_url=source, source_image_url=image, image_url=f'/products/catalog/{code}.png',
                image_gallery=[f'/products/catalog/{code}.png'], categories=categories)


def casio():
    result = []
    for row in json.loads((OUT / 'casio-source.json').read_text(encoding='utf-8')):
        code = row['sku']
        specs = dict(movement='Quartz', glass=row['glass'], water_resistance=row['water'],
                     case_material=row['case'], case_size=row['size'], strap_material=row['strap'],
                     dial_color=row['color'], functions=row['functions'])
        specs.update({'Kích thước dài × rộng × dày': row['dimensions'], 'Trọng lượng': row['weight'],
                      'Pin và tuổi thọ dự kiến': row['battery'], 'Độ chính xác': row['accuracy'],
                      'Quốc gia thương hiệu': 'Nhật Bản'})
        categories = ['pin-quartz', 'dong-ho-nu' if row['brand'] == 'BABY-G' else 'dong-ho-nam']
        if row['brand'] in ['BABY-G', 'G-SHOCK', 'EDIFICE'] or code.startswith('AE-'):
            categories.append('dong-ho-the-thao')
        if code in ['A700W-1A', 'F-91W-1']:
            categories += ['dong-ho-nu', 'dong-ho-dien-tu', 'dong-ho-vintage']
        elif code.startswith(('BGD-', 'DW-')):
            categories.append('dong-ho-dien-tu')
        elif code.startswith('AE-'):
            categories += ['dong-ho-dien-tu', 'dong-ho-gio-the-gioi']
        else:
            categories.append('dong-ho-cong-so')
        image = 'https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/' + row['imagePath']
        result.append(product(code, row['brand'], f'{row["brand"]} {row["series"]}', row['price'], specs,
                              row.get('source_url', f'https://www.casio.com/intl/watches/{row["family"]}/product.{code}/'), image, categories))
    return result


def seiko():
    result = []
    for code in SEIKO:
        page = load(code)
        text = page['text']
        text = text[text.index('Specifications'):text.index('Most Viewed')]
        diameter = next(item.split(':')[1] for item in text if item.startswith('Diameter:'))
        field = code in ['SRPG35', 'SRPJ85', 'SSK023']
        gmt = code.startswith('SSK')
        functions = 'Giờ, phút, giây, dừng kim giây, ' + ('lịch ngày, kim GMT 24 giờ' if gmt else 'lịch thứ và ngày')
        specs = dict(movement='Automatic', glass=translate(value(text, 'Crystal')),
                     water_resistance=value(text, 'Water Resistance'), case_material=translate(value(text, 'Case Material')),
                     case_size=diameter.replace('mm', ' mm'), strap_material='Nylon' if code in ['SRPG35', 'SRPJ85'] else 'Thép không gỉ',
                     dial_color=COLORS[code], functions=functions)
        specs.update({'Bộ máy': value(text, 'Caliber Number'), 'Trữ cót': 'Khoảng 41 giờ',
                      'Số chân kính': value(text, 'Jewels'), 'Độ dày': next(item.split(':')[1] for item in text if item.startswith('Thickness:')),
                      'Khoảng cách hai càng': next(item.split(':')[1] for item in text if item.startswith('Lug-to-lug:')),
                      'Bề rộng dây': value(text, 'Distance between lugs') + ' mm', 'Trọng lượng': value(text, 'Weight'),
                      'Kháng từ': value(text, 'Magnetic Resistance'), 'Quốc gia thương hiệu': 'Nhật Bản'})
        categories = ['dong-ho-nam', 'dong-ho-co', 'dong-ho-quan-doi' if field else 'dong-ho-the-thao']
        if gmt:
            categories.append('dong-ho-gmt')
        image = next(item['src'] for item in page['images'] if item.get('alt', '').startswith(code) and 'Product--Image' in item['src'])
        if image.startswith('/'):
            image = 'https://www.seikowatches.com' + image
        result.append(product(code, 'Seiko', 'Seiko 5 Sports' + (' GMT' if gmt else ' Field' if field else ''),
                              8900000 if gmt else 6200000 if field else 6500000, specs, page['url'], image, categories))
    return result


def tissot():
    result = []
    for code in TISSOT:
        page = load(code)
        text = page['text'][page['text'].index('Watch technical data'):]
        size = float(value(text, 'Case width (mm)'))
        auto = 'automatic' in value(text, 'Movement')
        series = 'Le Locle' if code.startswith('T006') else 'Gentleman' if code.startswith('T127') else 'PRX'
        specs = dict(movement='Automatic' if auto else 'Quartz', glass=translate(value(text, 'Crystal')),
                     water_resistance=re.search(r'(\d+) bar', value(text, 'Case water resistance')).group(1) + ' bar',
                     case_material=translate(value(text, 'Case material')), case_size=f'{size:g} mm',
                     strap_material=translate(value(text, 'Strap material')), dial_color=translate(value(text, 'Dial colour')),
                     functions='Giờ, phút, giây, lịch ngày' + (', báo hết pin EOL' if not auto else ''))
        specs.update({'Độ dày': value(text, 'Case thickness (mm)') + ' mm',
                      'Chiều dài vỏ': value(text, 'Case length (mm)') + ' mm',
                      'Bề rộng càng dây': value(text, 'Case lug width (mm)') + ' mm',
                      'Trọng lượng': value(text, 'Weight (g)') + ' g',
                      'Xuất xứ sản xuất': value(text, 'Country of manufacture'), 'Quốc gia thương hiệu': 'Thụy Sĩ',
                      'Khóa': 'Khóa bướm có nút bấm'})
        if auto:
            specs['Trữ cót'] = value(text, 'Power reserve (hours)') + ' giờ'
            specs['Bộ máy'] = 'Powermatic 80'
        categories = ['dong-ho-nam', 'dong-ho-co' if auto else 'pin-quartz', 'dong-ho-thuy-si', 'dong-ho-cong-so']
        if size <= 35:
            categories.append('dong-ho-nu')
        result.append(product(code, 'Tissot', f'Tissot {series}' + (' Powermatic 80' if auto else ' Quartz'),
                              22500000 if auto else 11500000, specs, page['url'], page['meta']['og:image'], categories))
    return result


if __name__ == '__main__':
    for name, rows in [('casio', casio()), ('seiko', seiko()), ('tissot', tissot())]:
        assert len(rows) == 10
        # Data files stay readable and under 300 lines each.
        output = '[\n' + ',\n'.join('  {\n' + ',\n'.join(
            '    ' + json.dumps(key) + ': ' + json.dumps(value, ensure_ascii=False)
            for key, value in row.items()) + '\n  }' for row in rows) + '\n]\n'
        (OUT / f'catalog-{name}.json').write_text(output, encoding='utf-8')
        print(f'{name}: {len(rows)} products')
