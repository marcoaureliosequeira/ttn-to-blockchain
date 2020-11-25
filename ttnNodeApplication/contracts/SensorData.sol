pragma solidity ^0.5.0;

contract SensorData {
    int public dataId = 0;
    int public dataIdError = 0;

    //TEMPERATURE RANGE VARIABLES
    int public temperatureLow = -30000;
    int public temperatureHigh = 50000;

    //HUMIDITY RANGE VARIABLES
    //int public humidityLow = 0.8;
    int public humidityLow = 800;
    int public humidityHigh = 103000;

    struct dataFromSensor {
        int id;
        int temperature;
        int humidity; //it could be fixed (int), but it isn't implemented yet in solidity (with fixed type it not compile and not migrate)
        string location;
        int light;
        int battery;
        string sensorEvent;
        string devId;
        string date;
        string logs;
    }

    mapping (int => dataFromSensor) public dataFromSensorArray; //associative array/hash, where key is a unsigned int and the array's content is a instance of Task
    mapping (int => dataFromSensor) public dataFromSensorErrorArray; //associative array/hash, where key is a unsigned int and the array's content is a instance of Task

    //EVENT WHEN DATA SENSOR IS CREATED
    event dataFromSensorCreated(
        int id,
        int temperature,
        int humidity,
        string location,
        int light,
        int battery,
        string sensorEvent,
        string devId,
        string date,
        string logs
    );

    function createDataSensor (int _temperature, int _humidity, string memory _location, int _light, 
        int _battery, string memory _sensorEvent, string memory _devId, string memory _date, string memory _logs) public {

        //VARIABLE TO CONTROL VALIDATIONS
        bool temperaturePersistenceTest = false;
        bool humidityPersistenceTest =false;
        string memory auxLog;

        //VALIDATE RECORD ONLY IF ALREADY EXISTS DATA SAVED
        //if(dataId >= 1 && _battery > 0) {
        if(true) {
            //--------------
            //--RANGE TEST--
            //--------------
            bool temperatureRangeTest = validateTemperatureRange(_temperature);

            if (temperatureRangeTest == true) {
                //-------------
                //--STEP TEST--
                //-------------
                bool temperatureStepTest = validateTemperatureStep(_temperature);

                if(temperatureStepTest == true) {
                    //-----------------------------
                    //--INTERNAL CONSISTENCY TEST--
                    //-----------------------------
                    bool temperatureInternalConsistencyTest = validateTemperatureInternalConsistencyTest(_temperature);

                    if(temperatureInternalConsistencyTest == true) {
                        //-----------------------------
                        //-------PERSISTENCE TEST------
                        //-----------------------------

                        temperaturePersistenceTest = validateTemperaturePersistenceTest(_temperature);

                        if(temperaturePersistenceTest == false) {
                            auxLog = "temperaturePersistenceTest";
                        }
                    }
                    else {
                        auxLog = "temperatureInternalConsistencyTest";
                    }
                }
                else {
                    auxLog = "temperatureStepTest";
                }
            }
            else {
                auxLog = "temperatureRangeTest";
            }

            //--------------
            //--RANGE TEST--
            //--------------
            bool humidityRangeTest = validateHumidityRange(_humidity);

            if (temperaturePersistenceTest == true && humidityRangeTest == true) {
                //-------------
                //--STEP TEST--
                //-------------
                bool humidityStepTest = validateHumidityStep(_humidity);

                if(humidityStepTest == true) {
                    //-----------------------------
                    //--INTERNAL CONSISTENCY TEST--
                    //-----------------------------
                    bool humidityInternalConsistencyTest = validateHumidityInternalConsistencyTest(_humidity);

                    if(humidityInternalConsistencyTest == true) {
                        //-----------------------------
                        //-------PERSISTENCE TEST------
                        //-----------------------------

                        humidityPersistenceTest = validateHumidityPersistenceTest(_humidity);
                    }
                    else {
                        auxLog = "humidityPersistenceTest";
                    }
                }
                else {
                    auxLog = "humidityStepTest";
                }
            }
            else if (temperaturePersistenceTest == true) {
                auxLog = "humidityRangeTest";
            }


            //if(temperaturePersistenceTest == true && humidityPersistenceTest == true) {
            if(temperaturePersistenceTest == true && humidityRangeTest == true) {
                //DATA ID
                dataId ++;

                //add a instance of dataFromSensor to dataFromSensorArray
                dataFromSensorArray[dataId] = dataFromSensor(dataId, _temperature, _humidity, _location, _light, _battery, _sensorEvent, _devId, _date, "success");

                emit dataFromSensorCreated(dataId, _temperature, _humidity, _location, _light, _battery, _sensorEvent, _devId, _date, "success");
            }
            else {
                //TODO: CREATE FUNCTION TO ADD VALUES TO ARRAY
                //DATA ID
                dataIdError ++;

                if(temperaturePersistenceTest == true)
                    auxLog = "humidityRangeTest";

                //add a instance of dataFromSensor to dataFromSensorArray
                dataFromSensorErrorArray[dataIdError] = dataFromSensor(dataId, _temperature, _humidity, _location, _light, _battery, _sensorEvent, _devId, _date, auxLog);

                emit dataFromSensorCreated(dataId, _temperature, _humidity, _location, _light, _battery, _sensorEvent, _devId, _date, auxLog);
            }
        }

        else {
            //DATA ID
            dataIdError ++;

            //add a instance of dataFromSensor to dataFromSensorArray
            dataFromSensorErrorArray[dataIdError] = dataFromSensor(dataId, _temperature, _humidity, _location, _light, _battery, _sensorEvent, _devId, _date, "battery");

            emit dataFromSensorCreated(dataId, _temperature, _humidity, _location, _light, _battery, _sensorEvent, _devId, _date, "battery");
        }

        /**
        if(_battery > 0 && validateValues == true) { //IF IS A VALID RECORD SAVE THIS ON CORRECT DATA ARRAY
            //DATA ID
            dataId ++;

            //add a instance of dataFromSensor to dataFromSensorArray
            dataFromSensorArray[dataId] = dataFromSensor(dataId, _temperature, _humidity, _location, _light, _battery, _sensorEvent, _devId, _date);

            emit dataFromSensorCreated(dataId, _temperature, _humidity, _location, _light, _battery, _sensorEvent, _devId, _date);
        }
        else { //IF IS A ERROR, SAVE THIS RECORD ON ERROR'S ARRAY
            //DATA ID
            dataIdError ++;

            //add a instance of dataFromSensor to dataFromSensorArray
            dataFromSensorErrorArray[dataIdError] = dataFromSensor(dataId, _temperature, _humidity, _location, _light, _battery, _sensorEvent, _devId, _date);

            emit dataFromSensorCreated(dataId, _temperature, _humidity, _location, _light, _battery, _sensorEvent, _devId, _date);
        }
        */
    }

    function getTaskCount() public returns (int) {
        return this.dataId();
    }


    //---------------------------------
    //-------HUMIDITY VALIDATIONS------
    //---------------------------------

    function validateHumidityRange(int _humidity) public returns (bool) {
        if(_humidity >= humidityLow && _humidity <= humidityHigh)
            return true;

        else
            return false;
    }

    function validateHumidityStep(int _humidity) public returns (bool) {

        if (dataId > 1) {
            int differenceBetweenValues;

            if(_humidity >= dataFromSensorArray[dataId].humidity)
                differenceBetweenValues = _humidity - dataFromSensorArray[dataId].humidity;

            else
                differenceBetweenValues = dataFromSensorArray[dataId].humidity - _humidity;

            //TODO: THIS VALUE SHOULD BE SEMI HOURLY
            //SEMI HOURLY DIFFERENCE < 45000
            //TODO: READ ARTICLE
            if(differenceBetweenValues < 90000) 
                return true;

            else
                return false;
        }
        else
            return false;
    }

    function validateHumidityInternalConsistencyTest (int _humidity) public returns (bool) {
        //RHx - Daily Maximum Relative Humidity
        //RHn - Daily Minimum Relative Humidity
        //RHm - Daily Mean Relative Humidity

        //RHx > RHm > RHn

        //RHx > max (RHsh)
        //RHn < min (RHsh)

        if(dataId >= 24) {
            if(getMaxHumidityDaily() > _humidity && getMinHumidityDaily() < _humidity)
                return true;
            else
                return false;
        }

        return true;
    }

    function validateHumidityPersistenceTest(int _humidity) public returns (bool) {
        if (dataId > 72) {

            //RH(d) != RH(d-1) != RH(d-2)
            if(_humidity != dataFromSensorArray[dataId - 23].humidity && _humidity != dataFromSensorArray[dataId - 47].humidity && _humidity != dataFromSensorArray[dataId - 71].humidity)
                return true;

            else
                return false;
        } else
            return false;
    }

    //#################################
    //#################################
    //#################################

    //---------------------------------
    //-----TEMPERATURE VALIDATIONS-----
    //---------------------------------

    function validateTemperatureRange(int _temperature) public returns (bool) {
        if(_temperature >= temperatureLow && _temperature <= temperatureHigh)
            return true;

        else
            return false;
    }

    function validateTemperatureStep (int _temperature) public returns (bool) {
        //IN ALGORITHM IS CONSIDERED SEMI HOURLY VALUES, BUT IS IN SETS OF TWO (IT MEANS HOURLY LIKE OUR DATASET)
        if(dataId >= 12) {
            //TODO:SELECT ONLY DATA OF THIS LOCATION!!
            int temperatureAtLastHour = dataFromSensorArray[dataId].temperature;
            int temperatureAtTwoHoursAgo = dataFromSensorArray[dataId-1].temperature;
            int temperatureAtThreeHoursAgo = dataFromSensorArray[dataId-2].temperature;
            int temperatureAtSixHoursAgo = dataFromSensorArray[dataId-5].temperature;
            int temperatureAtTwelveHoursAgo = dataFromSensorArray[dataId-11].temperature;

        
            int differenceLastHour;
            int differenceLastTwoHour;
            int differenceLastThreeHour;
            int differenceLastSixHour;
            int differenceLastTwelveHour;


            if(_temperature >= temperatureAtLastHour) {
                differenceLastHour = _temperature - temperatureAtLastHour;
            } else {
                differenceLastHour = temperatureAtLastHour - _temperature;
            }

            if(_temperature >= temperatureAtTwoHoursAgo) {
                differenceLastTwoHour = _temperature - temperatureAtTwoHoursAgo;
            } else {
                differenceLastTwoHour = temperatureAtTwoHoursAgo - _temperature;
            }

            if(_temperature >= temperatureAtThreeHoursAgo) {
                differenceLastThreeHour = _temperature - differenceLastThreeHour;
            } else {
                differenceLastThreeHour = differenceLastThreeHour - _temperature;
            }

            if(_temperature >= temperatureAtSixHoursAgo) {
                differenceLastSixHour = _temperature - temperatureAtSixHoursAgo;
            } else {
                differenceLastSixHour = temperatureAtSixHoursAgo - _temperature;
            }

            if(_temperature >= temperatureAtTwelveHoursAgo) {
                differenceLastTwelveHour = _temperature - temperatureAtTwelveHoursAgo;
            } else {
                differenceLastTwelveHour = temperatureAtTwelveHoursAgo - _temperature;
            }



            /**if (differenceLastHour < 0) {
                differenceLastHour = differenceLastHour * -1;
            }

            if (differenceLastTwoHour < 0) {
                differenceLastTwoHour = differenceLastTwoHour * -1;
            }

            if (differenceLastThreeHour < 0) {
                differenceLastThreeHour = differenceLastThreeHour * -1;
            }

            if (differenceLastSixHour < 0) {
                differenceLastSixHour = differenceLastSixHour * -1;
            }

            if (differenceLastTwelveHour < 0) {
                differenceLastTwelveHour = differenceLastTwelveHour * -1;
            }**/

            //TODO:MODULE CALCS
            if(differenceLastHour < 4000 && differenceLastTwoHour < 7000 && (differenceLastThreeHour < 9000 || differenceLastSixHour < 15000
                || differenceLastTwelveHour < 25000))
            {
                return true;
            }

            else
                return false;
        }
        else
            return true;
    }

    function validateTemperatureInternalConsistencyTest (int _temperature) public returns (bool) {
        int auxSum = 0;

        if(dataId >= 24) {
            int meanTemperatureDaily = getMeanTemperatureDaily();
            int maxTemperatureDaily = getMaxTemperatureDaily();
            int minTemperatureDaily = getMinTemperatureDaily();

            //FIRST VERIFICATION
            //Tx => Daily maximum temperature
            //Tm => Daily mean temperature
            //Tn => Daily minimum temperature
            //Tx > Tm > Tn
            bool firstVerification = false;
            bool secondVerification = false;
            bool thirdVerification = false;

            if(maxTemperatureDaily > meanTemperatureDaily && meanTemperatureDaily > minTemperatureDaily)
                firstVerification = true;

            if(firstVerification == true) {
                //SECOND VERIFICATION
                //Tx(d) > Tn(d-1)
                //Tn(d) <= Tx(d-1)
                int minTemperatureDayBefore = getMinTemperatureDayBefore();
                int maxTemperatureDayBefore = getMaxTemperatureDayBefore();

                if(maxTemperatureDaily > minTemperatureDayBefore && minTemperatureDaily <= maxTemperatureDayBefore)
                    secondVerification = true;

                secondVerification = true;

                if(secondVerification == true) {

                    //TODO: VERIFY

                    //THIRD VERIFICATION
                    //Tx > max(Tsh) - ADAPTED TO HOURLY VALUES, BECAUSE DATA SET HAS ONLY HOURLY VALUES
                    //Tn < min(Tsh) - ADAPTED TO HOURLY VALUES, BECAUSE DATA SET HAS ONLY HOURLY VALUES
                    int minTemperature = getMinTemperature();
                    int maxTemperature = getMaxTemperature();

                    //if(maxTemperature > _temperature && minTemperature < _temperature)
                        thirdVerification = true;
                }
            }

            if(thirdVerification == true)
                return true;
        }

        else
            return true;

        return false;
    }

    function validateTemperaturePersistenceTest (int _temperature) public returns (bool) {
        //T(d) != T(d-1) != T(d-2); - NOT USED, OUR DATA IS HOURLY
        //Tsh != Tsh-2 != Tsh-4 != Tsh-6 - ADAPTED TO HOURLY VALUES, BECAUSE DATA SET HAS ONLY HOURLY VALUES

        if (dataId < 4) {
            return true;
        } else if((_temperature != dataFromSensorArray[dataId].temperature) || (_temperature != dataFromSensorArray[dataId-1].temperature) || (_temperature != dataFromSensorArray[dataId - 2].temperature))
            return true;

        return false;
    }

    function getMeanTemperatureDaily () public returns (int) {
        int meanDailyTemperature;
        int auxSum = 0;

        for(int i = 1; i <= 24; i++) {
            auxSum += dataFromSensorArray[dataId - i].temperature;
        }

        meanDailyTemperature = auxSum/24;

        return meanDailyTemperature;
    }

    function getMaxTemperatureDaily () public returns (int) {
        int maxTemperatureDaily = -10000;

        for(int i = 1; i <= 24; i++) {
            if(dataFromSensorArray[dataId - i].temperature > maxTemperatureDaily)
                maxTemperatureDaily = dataFromSensorArray[dataId - i].temperature;
        }

        return maxTemperatureDaily;
    }

    function getMinTemperatureDaily () public returns (int) {
        int minTemperatureDaily = 1000000000;

        for(int i = 1; i <= 24; i++) {
            if(dataFromSensorArray[dataId - i].temperature < minTemperatureDaily)
                minTemperatureDaily = dataFromSensorArray[dataId - i].temperature;
        }

        return minTemperatureDaily;
    }

    function getMinTemperatureDayBefore () public returns (int) {
        int minTemperatureDaily = 1000000000;

        for(int i = 24; i <= 48; i++) {
            if(dataFromSensorArray[dataId - i].temperature < minTemperatureDaily)
                minTemperatureDaily = dataFromSensorArray[dataId - i].temperature;
        }

        return minTemperatureDaily;
    }

    function getMaxTemperatureDayBefore () public returns (int) {
        int maxTemperatureDaily = -1000000000;

        for(int i = 24; i <= 48; i++) {
            if(dataFromSensorArray[dataId - i].temperature > maxTemperatureDaily)
                maxTemperatureDaily = dataFromSensorArray[dataId - i].temperature;
        }

        return maxTemperatureDaily;
    }

    function getMaxTemperature() public returns (int) {
        int maxTemperatureDaily = -1000000000;

        for(int i = 1; i <= dataId; i++) {
            if(dataFromSensorArray[i].temperature > maxTemperatureDaily)
                maxTemperatureDaily = dataFromSensorArray[i].temperature;
        }

        return maxTemperatureDaily;
    }

    function getMinTemperature () public returns (int) {
        int minTemperatureDaily = 1000000000;

        for(int i = 1; i <= dataId; i++) {
            if(dataFromSensorArray[dataId].temperature < minTemperatureDaily)
                minTemperatureDaily = dataFromSensorArray[dataId].temperature;
        }

        return minTemperatureDaily;
    }

    function getMaxHumidity() public returns (int) {
        int maxHumidity = -1000000000;

        for(int i = 1; i <= dataId; i++) {
            if(dataFromSensorArray[i].humidity > maxHumidity)
                maxHumidity = dataFromSensorArray[i].humidity;
        }

        return maxHumidity;
    }

    function getMinHumidity () public returns (int) {
        int minHumidity = 1000000000;

        for(int i = 1; i <= dataId; i++) {
            if(dataFromSensorArray[dataId].humidity < minHumidity)
                minHumidity = dataFromSensorArray[dataId].humidity;
        }

        return minHumidity;
    }


    function getMaxHumidityDaily () public returns (int) {
        int maxHumidityDaily = -10000;

        for(int i = 1; i <= 24; i++) {
            if(dataFromSensorArray[dataId - i].humidity > maxHumidityDaily)
                maxHumidityDaily = dataFromSensorArray[dataId - i].humidity;
        }

        return maxHumidityDaily;
    }

    function getMinHumidityDaily () public returns (int) {
        int minHumidityDaily = 1000000000;

        for(int i = 1; i <= 24; i++) {
            if(dataFromSensorArray[dataId - i].humidity < minHumidityDaily)
                minHumidityDaily = dataFromSensorArray[dataId - i].humidity;
        }

        return minHumidityDaily;
    }


    //#################################
    //#################################
    //#################################

}
