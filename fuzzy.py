import pandas as pd

def read_data(file_path):
    data = pd.read_excel(file_path)
    return data

def fuzzify_service(service):
    if service <= 40:
        return {'Buruk': 1, 'Cukup': 0, 'Baik': 0}
    elif 40 < service <= 70:
        buruk = (70 - service) / 30
        cukup = (service - 40) / 30
        return {'Buruk': buruk, 'Cukup': cukup, 'Baik': 0}
    elif 70 < service <= 85:
        cukup = (85 - service) / 15
        baik = (service - 70) / 15
        return {'Buruk': 0, 'Cukup': cukup, 'Baik': baik}
    else:
        return {'Buruk': 0, 'Cukup': 0, 'Baik': 1}

def fuzzify_price(price):
    if price <= 35000:
        return {'Murah': 1, 'Sedang': 0, 'Mahal': 0}
    elif 35000 < price <= 45000:
        murah = (45000 - price) / 10000
        sedang = (price - 35000) / 10000
        return {'Murah': murah, 'Sedang': sedang, 'Mahal': 0}
    elif 45000 < price <= 50000:
        sedang = (50000 - price) / 5000
        mahal = (price - 45000) / 5000
        return {'Murah': 0, 'Sedang': sedang, 'Mahal': mahal}
    else:
        return {'Murah': 0, 'Sedang': 0, 'Mahal': 1}

def inferensi(service_fuzzy, price_fuzzy):
    rules = []
    output_scores = {'Tidak Layak': 30, 'Layak': 60, 'Sangat Layak': 90}
    
    rules.append((min(service_fuzzy['Baik'], price_fuzzy['Murah']), 'Sangat Layak'))
    rules.append((min(service_fuzzy['Baik'], price_fuzzy['Sedang']), 'Layak'))
    rules.append((min(service_fuzzy['Cukup'], price_fuzzy['Murah']), 'Layak'))
    rules.append((min(service_fuzzy['Cukup'], price_fuzzy['Sedang']), 'Layak'))
    rules.append((min(service_fuzzy['Cukup'], price_fuzzy['Mahal']), 'Tidak Layak'))
    rules.append((min(service_fuzzy['Buruk'], price_fuzzy['Murah']), 'Tidak Layak'))
    rules.append((min(service_fuzzy['Buruk'], price_fuzzy['Sedang']), 'Tidak Layak'))
    rules.append((min(service_fuzzy['Buruk'], price_fuzzy['Mahal']), 'Tidak Layak'))
    rules.append((min(service_fuzzy['Baik'], price_fuzzy['Mahal']), 'Layak'))

    return rules, output_scores

def defuzzification(rules, output_scores):
    numerator = 0
    denominator = 0
    for strength, label in rules:
        numerator += strength * output_scores[label]
        denominator += strength
    if denominator == 0:
        return 0
    return numerator / denominator

def main():
    data = read_data('restoran.xlsx')
    
    hasil = []

    for index, row in data.iterrows():
        service = row['Pelayanan']
        price = row['harga']

        service_fuzzy = fuzzify_service(service)
        price_fuzzy = fuzzify_price(price)

        rules, output_scores = inferensi(service_fuzzy, price_fuzzy)

        skor = defuzzification(rules, output_scores)

        hasil.append({
            'ID': row['id Pelanggan'],
            'Kualitas Servis': service,
            'Harga': price,
            'Skor Kelayakan': skor
        })

    hasil = sorted(hasil, key=lambda x: x['Skor Kelayakan'], reverse=True)

    top5 = hasil[:5]

    output_df = pd.DataFrame(top5)
    output_df.to_excel('peringkat.xlsx', index=False)

    print("5 Restoran Terbaik:")
    print(output_df)

if __name__ == '__main__':
    main()
