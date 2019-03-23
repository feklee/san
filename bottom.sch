EESchema Schematic File Version 4
LIBS:top-hemi-cache
EELAYER 29 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 3 3
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L Device:Battery_Cell BT?
U 1 1 5C99B5FE
P 1800 2450
AR Path="/5C99B5FE" Ref="BT?"  Part="1" 
AR Path="/5C920CA4/5C99B5FE" Ref="BT2"  Part="1" 
F 0 "BT2" H 1918 2546 50  0000 L CNN
F 1 "CR2032" H 1918 2455 50  0000 L CNN
F 2 "gsg-modules:BK-912" V 1800 2510 50  0001 C CNN
F 3 "http://www.memoryprotectiondevices.com/datasheets/BK-912-datasheet.pdf" V 1800 2510 50  0001 C CNN
F 4 "BK-912" H 0   0   50  0001 C CNN "MPN"
F 5 "1" H 0   0   50  0001 C CNN "Min Quantity"
	1    1800 2450
	1    0    0    -1  
$EndComp
Text HLabel 1950 1050 2    50   Input ~ 0
DIN-BOT
Text HLabel 1950 1150 2    50   Output ~ 0
BNC-3
Text HLabel 1950 1250 2    50   Output ~ 0
BNC-4
Text HLabel 1950 1350 2    50   Input ~ 0
5VIN
Text HLabel 1950 1450 2    50   UnSpc ~ 0
BATT-BOT
Text HLabel 1950 1550 2    50   UnSpc ~ 0
GNDB
$Comp
L power:GND #PWR0101
U 1 1 5CA58E18
P 1800 2550
F 0 "#PWR0101" H 1800 2300 50  0001 C CNN
F 1 "GND" H 1805 2377 50  0000 C CNN
F 2 "" H 1800 2550 50  0001 C CNN
F 3 "" H 1800 2550 50  0001 C CNN
	1    1800 2550
	1    0    0    -1  
$EndComp
Text Label 1800 2250 2    50   ~ 0
BATT-BOT
Text Label 1550 1450 0    50   ~ 0
BATT-BOT
$Comp
L Connector_Generic:Conn_01x02 J7
U 1 1 5CA5A9D9
P 3500 1000
F 0 "J7" H 3580 992 50  0000 L CNN
F 1 "Port_3" H 3580 901 50  0000 L CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical" H 3500 1000 50  0001 C CNN
F 3 "~" H 3500 1000 50  0001 C CNN
	1    3500 1000
	1    0    0    -1  
$EndComp
$Comp
L Connector_Generic:Conn_01x02 J8
U 1 1 5CA5ADA9
P 3500 1500
F 0 "J8" H 3580 1492 50  0000 L CNN
F 1 "Port_4" H 3580 1401 50  0000 L CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical" H 3500 1500 50  0001 C CNN
F 3 "~" H 3500 1500 50  0001 C CNN
	1    3500 1500
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0102
U 1 1 5CA792A5
P 1850 1600
F 0 "#PWR0102" H 1850 1350 50  0001 C CNN
F 1 "GND" H 1855 1427 50  0000 C CNN
F 2 "" H 1850 1600 50  0001 C CNN
F 3 "" H 1850 1600 50  0001 C CNN
	1    1850 1600
	1    0    0    -1  
$EndComp
Wire Wire Line
	1850 1550 1950 1550
$Comp
L power:+5V #PWR0103
U 1 1 5CA79E38
P 1450 950
F 0 "#PWR0103" H 1450 800 50  0001 C CNN
F 1 "+5V" H 1465 1123 50  0000 C CNN
F 2 "" H 1450 950 50  0001 C CNN
F 3 "" H 1450 950 50  0001 C CNN
	1    1450 950 
	1    0    0    -1  
$EndComp
Wire Wire Line
	1450 950  1450 1350
Wire Wire Line
	1450 1350 1950 1350
Text Label 1550 1250 0    50   ~ 0
BNC-4
Text Label 1550 1150 0    50   ~ 0
BNC-3
Text Label 1550 1050 0    50   ~ 0
DIN-BOT
$Comp
L Connector_Generic:Conn_01x06 J6
U 1 1 5CA7C65D
P 1100 1350
F 0 "J6" H 1100 950 50  0000 C CNN
F 1 "FFC-0.5MM-6POS" H 1250 1700 50  0000 C CNN
F 2 "Connector_FFC-FPC:Hirose_FH12-6S-0.5SH_1x06-1MP_P0.50mm_Horizontal" H 1100 1350 50  0001 C CNN
F 3 "http://file.elecfans.com/web1/M00/58/C8/o4YBAFte0lKAMHKmAAy2rm8BovQ141.pdf" H 1100 1350 50  0001 C CNN
F 4 "FH12-6S-0.5SH(55)" H 0   0   50  0001 C CNN "MPN"
F 5 "FH12-6S-0.5SH(55)" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "1" H 0   0   50  0001 C CNN "Min Quantity"
	1    1100 1350
	-1   0    0    1   
$EndComp
Wire Wire Line
	1300 1050 1950 1050
Wire Wire Line
	1300 1150 1950 1150
Wire Wire Line
	1300 1250 1950 1250
Wire Wire Line
	1300 1350 1450 1350
Connection ~ 1450 1350
Wire Wire Line
	1300 1450 1950 1450
Wire Wire Line
	1850 1600 1850 1550
Wire Wire Line
	1850 1550 1300 1550
Connection ~ 1850 1550
Text Label 2950 1000 0    50   ~ 0
BNC-3
Text Label 2950 1500 0    50   ~ 0
BNC-4
$Comp
L power:GND #PWR0104
U 1 1 5CA7ED40
P 3300 1600
F 0 "#PWR0104" H 3300 1350 50  0001 C CNN
F 1 "GND" H 3305 1427 50  0000 C CNN
F 2 "" H 3300 1600 50  0001 C CNN
F 3 "" H 3300 1600 50  0001 C CNN
	1    3300 1600
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0105
U 1 1 5CA7F049
P 3300 1100
F 0 "#PWR0105" H 3300 850 50  0001 C CNN
F 1 "GND" H 3305 927 50  0000 C CNN
F 2 "" H 3300 1100 50  0001 C CNN
F 3 "" H 3300 1100 50  0001 C CNN
	1    3300 1100
	1    0    0    -1  
$EndComp
Wire Wire Line
	2950 1000 3300 1000
Wire Wire Line
	3300 1500 2950 1500
$Comp
L power:+5V #PWR?
U 1 1 5CA85CAB
P 3350 2150
AR Path="/5CA85CAB" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5CA85CAB" Ref="#PWR?"  Part="1" 
AR Path="/5C920CA4/5CA85CAB" Ref="#PWR037"  Part="1" 
F 0 "#PWR037" H 3350 2000 50  0001 C CNN
F 1 "+5V" H 3365 2323 50  0000 C CNN
F 2 "" H 3350 2150 50  0001 C CNN
F 3 "" H 3350 2150 50  0001 C CNN
	1    3350 2150
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR?
U 1 1 5CA85CB1
P 4300 2150
AR Path="/5CA85CB1" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5CA85CB1" Ref="#PWR?"  Part="1" 
AR Path="/5C920CA4/5CA85CB1" Ref="#PWR039"  Part="1" 
F 0 "#PWR039" H 4300 2000 50  0001 C CNN
F 1 "+5V" H 4315 2323 50  0000 C CNN
F 2 "" H 4300 2150 50  0001 C CNN
F 3 "" H 4300 2150 50  0001 C CNN
	1    4300 2150
	1    0    0    -1  
$EndComp
$Comp
L Device:C_Small C?
U 1 1 5CA85CB7
P 3700 2350
AR Path="/5CA85CB7" Ref="C?"  Part="1" 
AR Path="/5C920754/5CA85CB7" Ref="C?"  Part="1" 
AR Path="/5C920CA4/5CA85CB7" Ref="C12"  Part="1" 
F 0 "C12" H 3792 2396 50  0000 L CNN
F 1 "0.1u" H 3792 2305 50  0000 L CNN
F 2 "Capacitor_SMD:C_0402_1005Metric" H 3700 2350 50  0001 C CNN
F 3 "~" H 3700 2350 50  0001 C CNN
F 4 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "MPN"
F 5 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "50" H 0   0   50  0001 C CNN "Min Quantity"
	1    3700 2350
	1    0    0    -1  
$EndComp
$Comp
L Device:C_Small C?
U 1 1 5CA85CBD
P 4650 2350
AR Path="/5CA85CBD" Ref="C?"  Part="1" 
AR Path="/5C920754/5CA85CBD" Ref="C?"  Part="1" 
AR Path="/5C920CA4/5CA85CBD" Ref="C13"  Part="1" 
F 0 "C13" H 4742 2396 50  0000 L CNN
F 1 "0.1u" H 4742 2305 50  0000 L CNN
F 2 "Capacitor_SMD:C_0402_1005Metric" H 4650 2350 50  0001 C CNN
F 3 "~" H 4650 2350 50  0001 C CNN
F 4 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "MPN"
F 5 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "50" H 0   0   50  0001 C CNN "Min Quantity"
	1    4650 2350
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5CA85CC5
P 4300 3000
AR Path="/5CA85CC5" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5CA85CC5" Ref="#PWR?"  Part="1" 
AR Path="/5C920CA4/5CA85CC5" Ref="#PWR040"  Part="1" 
F 0 "#PWR040" H 4300 2750 50  0001 C CNN
F 1 "GND" H 4305 2827 50  0000 C CNN
F 2 "" H 4300 3000 50  0001 C CNN
F 3 "" H 4300 3000 50  0001 C CNN
	1    4300 3000
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5CA85CCB
P 3350 3000
AR Path="/5CA85CCB" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5CA85CCB" Ref="#PWR?"  Part="1" 
AR Path="/5C920CA4/5CA85CCB" Ref="#PWR038"  Part="1" 
F 0 "#PWR038" H 3350 2750 50  0001 C CNN
F 1 "GND" H 3355 2827 50  0000 C CNN
F 2 "" H 3350 3000 50  0001 C CNN
F 3 "" H 3350 3000 50  0001 C CNN
	1    3350 3000
	1    0    0    -1  
$EndComp
Wire Wire Line
	3650 2600 4000 2600
$Comp
L LED:NeoPixel_THT D?
U 1 1 5CA85CD2
P 4300 2600
AR Path="/5CA85CD2" Ref="D?"  Part="1" 
AR Path="/5C920754/5CA85CD2" Ref="D?"  Part="1" 
AR Path="/5C920CA4/5CA85CD2" Ref="D5"  Part="1" 
F 0 "D5" H 4100 2850 50  0000 L CNN
F 1 "LED 4" H 4350 2350 50  0000 L CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x04_P2.54mm_Vertical" H 4350 2300 50  0001 L TNN
F 3 "https://www.adafruit.com/product/1938" H 4400 2225 50  0001 L TNN
F 4 "1938" H 0   0   50  0001 C CNN "MPN"
F 5 "1528-1959-ND	" H 0   0   50  0001 C CNN "SKU"
F 6 "5" H 0   0   50  0001 C CNN "Min Quantity"
	1    4300 2600
	1    0    0    -1  
$EndComp
$Comp
L LED:NeoPixel_THT D?
U 1 1 5CA85CD8
P 3350 2600
AR Path="/5CA85CD8" Ref="D?"  Part="1" 
AR Path="/5C920754/5CA85CD8" Ref="D?"  Part="1" 
AR Path="/5C920CA4/5CA85CD8" Ref="D4"  Part="1" 
F 0 "D4" H 3150 2850 50  0000 L CNN
F 1 "LED 3" H 3400 2350 50  0000 L CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x04_P2.54mm_Vertical" H 3400 2300 50  0001 L TNN
F 3 "https://www.adafruit.com/product/1938" H 3450 2225 50  0001 L TNN
F 4 "1938" H 0   0   50  0001 C CNN "MPN"
F 5 "1528-1959-ND	" H 0   0   50  0001 C CNN "SKU"
F 6 "5" H 0   0   50  0001 C CNN "Min Quantity"
	1    3350 2600
	1    0    0    -1  
$EndComp
Wire Wire Line
	3350 2150 3350 2250
Wire Wire Line
	3350 2250 3700 2250
Connection ~ 3350 2250
Wire Wire Line
	3350 2250 3350 2300
Wire Wire Line
	3350 2950 3700 2950
Wire Wire Line
	3700 2950 3700 2450
Wire Wire Line
	3350 2900 3350 2950
Connection ~ 3350 2950
Wire Wire Line
	3350 2950 3350 3000
Wire Wire Line
	4300 2300 4300 2250
Wire Wire Line
	4300 2250 4650 2250
Connection ~ 4300 2250
Wire Wire Line
	4300 2250 4300 2150
Wire Wire Line
	4300 3000 4300 2950
Wire Wire Line
	4300 2950 4650 2950
Wire Wire Line
	4650 2950 4650 2450
Connection ~ 4300 2950
Wire Wire Line
	4300 2950 4300 2900
Text Label 2650 2600 0    50   ~ 0
DIN-BOT
Wire Wire Line
	2650 2600 3050 2600
$EndSCHEMATC
