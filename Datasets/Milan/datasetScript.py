import csv

from pip._vendor.distlib.compat import raw_input

finalArray = {}

weatherStationName = raw_input("Please enter weather station name: ")

try:
    locationFile = open(weatherStationName + "/Location.txt", "r")
    location = locationFile.read()
    print("location")
    print(location)
except:
    location = ''
    print("error open file")

with open(weatherStationName + '/' + weatherStationName + '_mi_meteo_temp.csv') as csv_file_temperature:
    csv_reader_temperature = csv.reader(csv_file_temperature, delimiter=',')
    line_count = 0

    for row_temperature in csv_reader_temperature:
        finalArray[row_temperature[1]] = [location, row_temperature[1], row_temperature[2]]

with open(weatherStationName + '/' + weatherStationName + '_mi_meteo_hum.csv') as csv_file_humidity:
    csv_reader_humidity = csv.reader(csv_file_humidity, delimiter=',')
    line_count = 0

    for row_humidity in csv_reader_humidity:
        try:
            finalArray[row_humidity[1]] += [row_humidity[2]]
        except:
            print(row_humidity[1])
            print("Index does not exist")

try:
    with open(weatherStationName + '/' + weatherStationName + 'data_compiled.csv', mode='w+',
              newline='') as data_compiled_file:
        data_file_writer = csv.writer(data_compiled_file, delimiter=';')

        for key in finalArray:
            data_file_writer.writerow(finalArray[key])
except:
    print("error in data compiled file")

print("final")
