EESchema Schematic File Version 4
LIBS:node-cache
EELAYER 26 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 5
Title "Node"
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 "ADXL335 circuit based on that of Adafruit 5V ADXL335 breakout board & EVAL-ADXL335Z"
Comment4 "MIC5205 circuit based on Arduino Pro Mini circuit"
$EndDescr
$Comp
L Device:Resonator Y1
U 1 1 5C7ED6B7
P 3050 2250
F 0 "Y1" V 3096 2360 50  0000 L CNN
F 1 "16MHz" V 3005 2360 50  0000 L CNN
F 2 "Crystal:Resonator_SMD_muRata_CSTxExxV-3Pin_3.0x1.1mm_HandSoldering" H 3025 2250 50  0001 C CNN
F 3 "~" H 3025 2250 50  0001 C CNN
	1    3050 2250
	0    -1   -1   0   
$EndComp
Wire Wire Line
	2200 2200 2650 2200
Wire Wire Line
	2650 2200 2650 2000
Wire Wire Line
	2650 2000 3050 2000
Wire Wire Line
	3050 2000 3050 2100
Wire Wire Line
	2200 2300 2650 2300
Wire Wire Line
	2650 2300 2650 2500
Wire Wire Line
	2650 2500 3050 2500
Wire Wire Line
	3050 2500 3050 2400
$Comp
L power:GND #PWR0102
U 1 1 5C7EDAEC
P 3350 2400
F 0 "#PWR0102" H 3350 2150 50  0001 C CNN
F 1 "GND" H 3355 2227 50  0000 C CNN
F 2 "" H 3350 2400 50  0001 C CNN
F 3 "" H 3350 2400 50  0001 C CNN
	1    3350 2400
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0103
U 1 1 5C7EDC56
P 1600 4400
F 0 "#PWR0103" H 1600 4150 50  0001 C CNN
F 1 "GND" H 1605 4227 50  0000 C CNN
F 2 "" H 1600 4400 50  0001 C CNN
F 3 "" H 1600 4400 50  0001 C CNN
	1    1600 4400
	1    0    0    -1  
$EndComp
Wire Wire Line
	1600 1100 1600 1200
Wire Wire Line
	1700 1300 1700 1200
Wire Wire Line
	1700 1200 1600 1200
Connection ~ 1600 1200
Wire Wire Line
	1600 1200 1600 1300
Wire Wire Line
	5750 6250 5750 6050
$Comp
L power:GND #PWR0108
U 1 1 5C7EEA4E
P 8800 1900
F 0 "#PWR0108" H 8800 1650 50  0001 C CNN
F 1 "GND" H 8805 1727 50  0000 C CNN
F 2 "" H 8800 1900 50  0001 C CNN
F 3 "" H 8800 1900 50  0001 C CNN
	1    8800 1900
	1    0    0    -1  
$EndComp
$Comp
L Device:C C5
U 1 1 5C7EEDE3
P 5750 6400
F 0 "C5" H 5865 6446 50  0000 L CNN
F 1 "0.1uF" H 5865 6355 50  0000 L CNN
F 2 "Capacitor_SMD:C_0603_1608Metric_Pad1.05x0.95mm_HandSolder" H 5788 6250 50  0001 C CNN
F 3 "~" H 5750 6400 50  0001 C CNN
	1    5750 6400
	1    0    0    -1  
$EndComp
Wire Wire Line
	8500 1450 8300 1450
Wire Wire Line
	8300 1450 8300 1350
Wire Wire Line
	8300 1350 7800 1350
Wire Wire Line
	7800 1350 7800 1450
Connection ~ 7800 1350
$Comp
L power:GND #PWR0110
U 1 1 5C7F3D7E
P 9700 1900
F 0 "#PWR0110" H 9700 1650 50  0001 C CNN
F 1 "GND" H 9705 1727 50  0000 C CNN
F 2 "" H 9700 1900 50  0001 C CNN
F 3 "" H 9700 1900 50  0001 C CNN
	1    9700 1900
	1    0    0    -1  
$EndComp
Wire Wire Line
	9100 1350 9700 1350
Wire Wire Line
	9700 1350 9700 1450
Wire Wire Line
	9700 1350 10200 1350
Wire Wire Line
	10200 1350 10200 1450
Connection ~ 9700 1350
$Comp
L power:GND #PWR0111
U 1 1 5C7F4D95
P 10200 1900
F 0 "#PWR0111" H 10200 1650 50  0001 C CNN
F 1 "GND" H 10205 1727 50  0000 C CNN
F 2 "" H 10200 1900 50  0001 C CNN
F 3 "" H 10200 1900 50  0001 C CNN
	1    10200 1900
	1    0    0    -1  
$EndComp
Wire Wire Line
	10200 1350 10450 1350
Wire Wire Line
	10450 1350 10450 1150
Connection ~ 10200 1350
$Comp
L Device:R_US R1
U 1 1 5C7F8CAB
P 2450 2900
F 0 "R1" H 2518 2946 50  0000 L CNN
F 1 "10k" H 2518 2855 50  0000 L CNN
F 2 "Resistor_SMD:R_0603_1608Metric_Pad1.05x0.95mm_HandSolder" V 2490 2890 50  0001 C CNN
F 3 "~" H 2450 2900 50  0001 C CNN
	1    2450 2900
	1    0    0    -1  
$EndComp
Wire Wire Line
	2200 3100 2450 3100
Wire Wire Line
	2450 3100 2450 3050
Wire Wire Line
	2450 2700 2450 2750
Wire Wire Line
	2450 3100 2800 3100
Connection ~ 2450 3100
Text GLabel 3150 3100 2    50   Input ~ 0
DTR
$Comp
L Connector_Generic:Conn_01x06 J2
U 1 1 5C7FBAB7
P 3200 6400
F 0 "J2" H 3200 6000 50  0000 L CNN
F 1 "FTDI Basic" H 2850 6700 50  0000 L CNN
F 2 "Common-Parts-Library:HARWIN_M20-7910642R" H 3200 6400 50  0001 C CNN
F 3 "https://cdn.harwin.com/pdfs/M20-791R.pdf" H 3200 6400 50  0001 C CNN
	1    3200 6400
	-1   0    0    1   
$EndComp
$Comp
L power:GND #PWR0115
U 1 1 5C800F0E
P 3800 6750
F 0 "#PWR0115" H 3800 6500 50  0001 C CNN
F 1 "GND" H 3805 6577 50  0000 C CNN
F 2 "" H 3800 6750 50  0001 C CNN
F 3 "" H 3800 6750 50  0001 C CNN
	1    3800 6750
	1    0    0    -1  
$EndComp
Wire Wire Line
	3900 6300 3900 6050
Text GLabel 3450 6400 2    50   Input ~ 0
RXI
Text GLabel 3450 6500 2    50   Input ~ 0
TXO
Text GLabel 3450 6600 2    50   Input ~ 0
DTR
Wire Wire Line
	3450 6400 3400 6400
Wire Wire Line
	3400 6500 3450 6500
Wire Wire Line
	3450 6600 3400 6600
Wire Wire Line
	3400 6300 3900 6300
Wire Wire Line
	3800 6100 3800 6200
Wire Wire Line
	3400 6100 3800 6100
Wire Wire Line
	3400 6200 3800 6200
Connection ~ 3800 6200
Wire Wire Line
	3800 6200 3800 6750
$Comp
L Connector_Generic:Conn_01x06 J3
U 1 1 5C80A195
P 4600 6400
F 0 "J3" H 4600 6000 50  0000 L CNN
F 1 "Burner" H 4400 6700 50  0000 L CNN
F 2 "Connector_PinSocket_2.54mm:PinSocket_1x06_P2.54mm_Vertical" H 4600 6400 50  0001 C CNN
F 3 "~" H 4600 6400 50  0001 C CNN
	1    4600 6400
	-1   0    0    1   
$EndComp
$Comp
L power:GND #PWR0117
U 1 1 5C80A53B
P 5250 6750
F 0 "#PWR0117" H 5250 6500 50  0001 C CNN
F 1 "GND" H 5255 6577 50  0000 C CNN
F 2 "" H 5250 6750 50  0001 C CNN
F 3 "" H 5250 6750 50  0001 C CNN
	1    5250 6750
	1    0    0    -1  
$EndComp
Text GLabel 2300 3300 2    50   Input ~ 0
RXI
Text GLabel 2300 3400 2    50   Input ~ 0
TXO
Wire Wire Line
	2300 3300 2200 3300
Wire Wire Line
	2200 3400 2300 3400
Text GLabel 2300 1900 2    50   Input ~ 0
MOSI
Text GLabel 2300 2000 2    50   Input ~ 0
MISO
Text GLabel 2300 2100 2    50   Input ~ 0
SCK
Wire Wire Line
	2300 1900 2200 1900
Wire Wire Line
	2300 2000 2200 2000
Wire Wire Line
	2200 2100 2300 2100
Wire Wire Line
	4800 6200 5350 6200
Wire Wire Line
	5350 6200 5350 6050
Wire Wire Line
	4800 6100 5250 6100
Wire Wire Line
	5250 6100 5250 6750
Text GLabel 4900 6300 2    50   Input ~ 0
MOSI
Text GLabel 4900 6400 2    50   Input ~ 0
MISO
Text GLabel 4900 6500 2    50   Input ~ 0
SCK
Text GLabel 4900 6600 2    50   Input ~ 0
DTR
Wire Wire Line
	4900 6300 4800 6300
Wire Wire Line
	4800 6400 4900 6400
Wire Wire Line
	4900 6500 4800 6500
Wire Wire Line
	4800 6600 4900 6600
$Comp
L Device:Battery BT1
U 1 1 5C81AC66
P 2200 6750
F 0 "BT1" H 2308 6796 50  0000 L CNN
F 1 "BK-912" H 2308 6705 50  0000 L CNN
F 2 "SnapEDA:BAT_BK-913-TR" V 2200 6810 50  0001 C CNN
F 3 "http://www.memoryprotectiondevices.com/datasheets/BK-912-datasheet.pdf" V 2200 6810 50  0001 C CNN
	1    2200 6750
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0118
U 1 1 5C81AF18
P 2200 7000
F 0 "#PWR0118" H 2200 6750 50  0001 C CNN
F 1 "GND" H 2205 6827 50  0000 C CNN
F 2 "" H 2200 7000 50  0001 C CNN
F 3 "" H 2200 7000 50  0001 C CNN
	1    2200 7000
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0119
U 1 1 5C85E55F
P 2000 7000
F 0 "#PWR0119" H 2000 6750 50  0001 C CNN
F 1 "GND" H 2005 6827 50  0000 C CNN
F 2 "" H 2000 7000 50  0001 C CNN
F 3 "" H 2000 7000 50  0001 C CNN
	1    2000 7000
	1    0    0    -1  
$EndComp
Wire Wire Line
	1350 6650 2000 6650
Wire Wire Line
	2000 6650 2000 7000
Wire Wire Line
	1350 6550 2200 6550
$Comp
L Device:Battery BT2
U 1 1 5C8658D9
P 8750 5700
F 0 "BT2" H 8858 5746 50  0000 L CNN
F 1 "BK-912" H 8858 5655 50  0000 L CNN
F 2 "SnapEDA:BAT_BK-913-TR" V 8750 5760 50  0001 C CNN
F 3 "http://www.memoryprotectiondevices.com/datasheets/BK-912-datasheet.pdf" V 8750 5760 50  0001 C CNN
	1    8750 5700
	1    0    0    -1  
$EndComp
Wire Wire Line
	1350 6450 2500 6450
Wire Wire Line
	2500 6450 2500 6050
Text GLabel 1400 6150 2    50   Input ~ 0
PORT-3
Text GLabel 1400 6050 2    50   Input ~ 0
PORT-4
Text GLabel 1400 5950 2    50   Input ~ 0
NEOPIXEL-2-DO
Wire Wire Line
	1400 5950 1350 5950
Wire Wire Line
	1350 6050 1400 6050
Wire Wire Line
	1350 6150 1400 6150
Text GLabel 7500 5300 2    50   Input ~ 0
NEOPIXEL-2-DO
Wire Wire Line
	7500 5300 7450 5300
Text GLabel 7500 5500 2    50   Input ~ 0
PORT-3
Text GLabel 7500 5400 2    50   Input ~ 0
PORT-4
Wire Wire Line
	7450 5400 7500 5400
Wire Wire Line
	7450 5500 7500 5500
$Comp
L Connector_Generic:Conn_01x02 J4
U 1 1 5C8B4932
P 4700 1650
F 0 "J4" H 4700 1450 50  0000 C CNN
F 1 "Port" H 4650 1750 50  0000 C CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical" H 4700 1650 50  0001 C CNN
F 3 "~" H 4700 1650 50  0001 C CNN
	1    4700 1650
	-1   0    0    1   
$EndComp
Wire Notes Line
	6300 550  6300 7750
Text Notes 600  700  0    100  ~ 0
Top Hemisphere
Text Notes 6450 700  0    100  ~ 0
Bottom Hemisphere
$Comp
L power:GND #PWR0123
U 1 1 5C9389CA
P 5300 1700
F 0 "#PWR0123" H 5300 1450 50  0001 C CNN
F 1 "GND" H 5305 1527 50  0000 C CNN
F 2 "" H 5300 1700 50  0001 C CNN
F 3 "" H 5300 1700 50  0001 C CNN
	1    5300 1700
	1    0    0    -1  
$EndComp
Wire Wire Line
	5300 1650 5300 1700
Wire Wire Line
	4900 1650 5300 1650
Text GLabel 4950 1550 2    50   Input ~ 0
PORT-1
Wire Wire Line
	4950 1550 4900 1550
$Comp
L Connector_Generic:Conn_01x02 J5
U 1 1 5C9479FD
P 4700 2200
F 0 "J5" H 4700 2000 50  0000 C CNN
F 1 "Port" H 4650 2300 50  0000 C CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical" H 4700 2200 50  0001 C CNN
F 3 "~" H 4700 2200 50  0001 C CNN
	1    4700 2200
	-1   0    0    1   
$EndComp
$Comp
L power:GND #PWR0124
U 1 1 5C947A04
P 5300 2250
F 0 "#PWR0124" H 5300 2000 50  0001 C CNN
F 1 "GND" H 5305 2077 50  0000 C CNN
F 2 "" H 5300 2250 50  0001 C CNN
F 3 "" H 5300 2250 50  0001 C CNN
	1    5300 2250
	1    0    0    -1  
$EndComp
Wire Wire Line
	5300 2200 5300 2250
Wire Wire Line
	4900 2200 5300 2200
Text GLabel 4950 2100 2    50   Input ~ 0
PORT-2
Wire Wire Line
	4950 2100 4900 2100
$Comp
L Device:R_US R4
U 1 1 5C94A7DE
P 2900 3500
F 0 "R4" V 2850 3350 50  0000 C CNN
F 1 "470" V 2850 3650 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric_Pad1.05x0.95mm_HandSolder" V 2940 3490 50  0001 C CNN
F 3 "~" H 2900 3500 50  0001 C CNN
	1    2900 3500
	0    1    1    0   
$EndComp
Text GLabel 3200 3500 2    50   Input ~ 0
PORT-1
Wire Wire Line
	3050 3500 3200 3500
$Comp
L Device:R_US R5
U 1 1 5C94F6B2
P 2900 3600
F 0 "R5" V 2850 3450 50  0000 C CNN
F 1 "470" V 2850 3750 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric_Pad1.05x0.95mm_HandSolder" V 2940 3590 50  0001 C CNN
F 3 "~" H 2900 3600 50  0001 C CNN
	1    2900 3600
	0    1    1    0   
$EndComp
Text GLabel 3200 3600 2    50   Input ~ 0
PORT-2
Wire Wire Line
	3200 3600 3050 3600
Wire Wire Line
	2200 3500 2750 3500
$Comp
L Device:R_US R2
U 1 1 5C960B5D
P 2900 1600
F 0 "R2" V 2850 1450 50  0000 C CNN
F 1 "470" V 2850 1750 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric_Pad1.05x0.95mm_HandSolder" V 2940 1590 50  0001 C CNN
F 3 "~" H 2900 1600 50  0001 C CNN
	1    2900 1600
	0    1    1    0   
$EndComp
Text GLabel 3200 1600 2    50   Input ~ 0
PORT-3
Wire Wire Line
	3050 1600 3200 1600
$Comp
L Device:R_US R3
U 1 1 5C960B66
P 2900 1700
F 0 "R3" V 2850 1550 50  0000 C CNN
F 1 "470" V 2850 1850 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric_Pad1.05x0.95mm_HandSolder" V 2940 1690 50  0001 C CNN
F 3 "~" H 2900 1700 50  0001 C CNN
	1    2900 1700
	0    1    1    0   
$EndComp
Text GLabel 3200 1700 2    50   Input ~ 0
PORT-4
Wire Wire Line
	3200 1700 3050 1700
$Comp
L Connector_Generic:Conn_01x02 J7
U 1 1 5C9662A2
P 9700 5450
F 0 "J7" H 9700 5250 50  0000 C CNN
F 1 "Port" H 9650 5550 50  0000 C CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical" H 9700 5450 50  0001 C CNN
F 3 "~" H 9700 5450 50  0001 C CNN
	1    9700 5450
	-1   0    0    1   
$EndComp
Text GLabel 9950 5350 2    50   Input ~ 0
PORT-3
Wire Wire Line
	9950 5350 9900 5350
$Comp
L Connector_Generic:Conn_01x02 J8
U 1 1 5C9662B3
P 9700 6000
F 0 "J8" H 9700 5800 50  0000 C CNN
F 1 "Port" H 9650 6100 50  0000 C CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x02_P2.54mm_Vertical" H 9700 6000 50  0001 C CNN
F 3 "~" H 9700 6000 50  0001 C CNN
	1    9700 6000
	-1   0    0    1   
$EndComp
$Comp
L power:GND #PWR0126
U 1 1 5C9662BA
P 10300 6050
F 0 "#PWR0126" H 10300 5800 50  0001 C CNN
F 1 "GND" H 10305 5877 50  0000 C CNN
F 2 "" H 10300 6050 50  0001 C CNN
F 3 "" H 10300 6050 50  0001 C CNN
	1    10300 6050
	1    0    0    -1  
$EndComp
Wire Wire Line
	10300 6000 10300 6050
Wire Wire Line
	9900 6000 10300 6000
Text GLabel 9950 5900 2    50   Input ~ 0
PORT-4
Wire Wire Line
	9950 5900 9900 5900
Wire Wire Line
	850  1600 1000 1600
$Comp
L Device:R_US R6
U 1 1 5CA711D8
P 2900 3700
F 0 "R6" V 2850 3550 50  0000 C CNN
F 1 "470" V 2850 3850 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric_Pad1.05x0.95mm_HandSolder" V 2940 3690 50  0001 C CNN
F 3 "~" H 2900 3700 50  0001 C CNN
	1    2900 3700
	0    1    1    0   
$EndComp
Wire Wire Line
	2200 3600 2750 3600
Wire Wire Line
	2200 3700 2750 3700
Wire Wire Line
	2200 1600 2750 1600
Wire Wire Line
	2200 1700 2750 1700
$Comp
L power:GND #PWR0125
U 1 1 5CC844F9
P 10300 5500
F 0 "#PWR0125" H 10300 5250 50  0001 C CNN
F 1 "GND" H 10305 5327 50  0000 C CNN
F 2 "" H 10300 5500 50  0001 C CNN
F 3 "" H 10300 5500 50  0001 C CNN
	1    10300 5500
	1    0    0    -1  
$EndComp
Wire Wire Line
	9900 5450 10300 5450
Wire Wire Line
	10300 5450 10300 5500
$Comp
L power:GND #PWR0101
U 1 1 5CC94662
P 850 2100
F 0 "#PWR0101" H 850 1850 50  0001 C CNN
F 1 "GND" H 855 1927 50  0000 C CNN
F 2 "" H 850 2100 50  0001 C CNN
F 3 "" H 850 2100 50  0001 C CNN
	1    850  2100
	1    0    0    -1  
$EndComp
$Sheet
S 3650 3600 700  200 
U 5CCF6A6A
F0 "NeoPixel 1" 50
F1 "neopixel.sch" 50
F2 "DIN" I L 3650 3700 50 
F3 "DO" O R 4350 3700 50 
$EndSheet
$Sheet
S 4750 3600 700  200 
U 5CD0AE36
F0 "NeoPixel 2" 50
F1 "neopixel.sch" 50
F2 "DIN" I L 4750 3700 50 
F3 "DO" O R 5450 3700 50 
$EndSheet
$Sheet
S 8300 2750 700  200 
U 5CD1030A
F0 "NeoPixel 3" 50
F1 "neopixel.sch" 50
F2 "DIN" I L 8300 2850 50 
F3 "DO" O R 9000 2850 50 
$EndSheet
$Sheet
S 9500 2750 700  200 
U 5CD15399
F0 "NeoPixel 4" 50
F1 "neopixel.sch" 50
F2 "DIN" I L 9500 2850 50 
F3 "DO" O R 10200 2850 50 
$EndSheet
$Comp
L Device:R_US R7
U 1 1 5CD25E18
P 4550 3700
F 0 "R7" V 4345 3700 50  0000 C CNN
F 1 "33" V 4436 3700 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric_Pad1.05x0.95mm_HandSolder" V 4590 3690 50  0001 C CNN
F 3 "~" H 4550 3700 50  0001 C CNN
	1    4550 3700
	0    1    1    0   
$EndComp
Wire Wire Line
	4350 3700 4400 3700
Wire Wire Line
	4700 3700 4750 3700
Wire Wire Line
	5450 3700 5500 3700
Text GLabel 5500 3700 2    50   Input ~ 0
NEOPIXEL-2-DO
Text GLabel 7800 2850 0    50   Input ~ 0
NEOPIXEL-2-DO
$Comp
L Device:R_US R8
U 1 1 5CD49AB0
P 8050 2850
F 0 "R8" V 7845 2850 50  0000 C CNN
F 1 "33" V 7936 2850 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric_Pad1.05x0.95mm_HandSolder" V 8090 2840 50  0001 C CNN
F 3 "~" H 8050 2850 50  0001 C CNN
	1    8050 2850
	0    1    1    0   
$EndComp
Wire Wire Line
	7800 2850 7900 2850
Wire Wire Line
	8200 2850 8300 2850
$Comp
L Device:R_US R9
U 1 1 5CD51226
P 9250 2850
F 0 "R9" V 9045 2850 50  0000 C CNN
F 1 "33" V 9136 2850 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric_Pad1.05x0.95mm_HandSolder" V 9290 2840 50  0001 C CNN
F 3 "~" H 9250 2850 50  0001 C CNN
	1    9250 2850
	0    1    1    0   
$EndComp
Wire Wire Line
	9000 2850 9100 2850
Wire Wire Line
	9400 2850 9500 2850
Wire Wire Line
	3050 3700 3650 3700
Wire Wire Line
	7450 5900 8750 5900
$Comp
L SparkFun-Sensors:ADXL335 U4
U 1 1 5CD75468
P 9850 4150
F 0 "U4" H 9500 4600 45  0000 C CNN
F 1 "ADXL335" H 10100 3700 45  0000 C CNN
F 2 "Package_CSP:LFCSP-16-1EP_4x4mm_P0.65mm_EP2.1x2.1mm" H 9850 4700 20  0001 C CNN
F 3 "https://www.analog.com/media/en/technical-documentation/data-sheets/ADXL335.pdf" H 9850 4150 60  0001 C CNN
F 4 "IC-08942" H 9850 4631 60  0000 C CNN "Field4"
	1    9850 4150
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0105
U 1 1 5CD8E1AB
P 7700 4450
F 0 "#PWR0105" H 7700 4200 50  0001 C CNN
F 1 "GND" H 7705 4277 50  0000 C CNN
F 2 "" H 7700 4450 50  0001 C CNN
F 3 "" H 7700 4450 50  0001 C CNN
	1    7700 4450
	1    0    0    -1  
$EndComp
Wire Wire Line
	7700 4350 7700 4450
Wire Wire Line
	7100 3800 7100 3950
Wire Wire Line
	7100 3950 7300 3950
$Comp
L power:+3V3 #PWR0106
U 1 1 5CD95EEF
P 8350 3800
F 0 "#PWR0106" H 8350 3650 50  0001 C CNN
F 1 "+3V3" H 8365 3973 50  0000 C CNN
F 2 "" H 8350 3800 50  0001 C CNN
F 3 "" H 8350 3800 50  0001 C CNN
	1    8350 3800
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR0112
U 1 1 5CD96244
P 1600 1100
F 0 "#PWR0112" H 1600 950 50  0001 C CNN
F 1 "+5V" H 1615 1273 50  0000 C CNN
F 2 "" H 1600 1100 50  0001 C CNN
F 3 "" H 1600 1100 50  0001 C CNN
	1    1600 1100
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR0113
U 1 1 5CD96C9F
P 2450 2700
F 0 "#PWR0113" H 2450 2550 50  0001 C CNN
F 1 "+5V" H 2465 2873 50  0000 C CNN
F 2 "" H 2450 2700 50  0001 C CNN
F 3 "" H 2450 2700 50  0001 C CNN
	1    2450 2700
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR0116
U 1 1 5CD9B0CE
P 2500 6050
F 0 "#PWR0116" H 2500 5900 50  0001 C CNN
F 1 "+5V" H 2515 6223 50  0000 C CNN
F 2 "" H 2500 6050 50  0001 C CNN
F 3 "" H 2500 6050 50  0001 C CNN
	1    2500 6050
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR0121
U 1 1 5CD9B117
P 3900 6050
F 0 "#PWR0121" H 3900 5900 50  0001 C CNN
F 1 "+5V" H 3915 6223 50  0000 C CNN
F 2 "" H 3900 6050 50  0001 C CNN
F 3 "" H 3900 6050 50  0001 C CNN
	1    3900 6050
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR0122
U 1 1 5CD9B160
P 5350 6050
F 0 "#PWR0122" H 5350 5900 50  0001 C CNN
F 1 "+5V" H 5365 6223 50  0000 C CNN
F 2 "" H 5350 6050 50  0001 C CNN
F 3 "" H 5350 6050 50  0001 C CNN
	1    5350 6050
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR0127
U 1 1 5CD9B1A9
P 5750 6050
F 0 "#PWR0127" H 5750 5900 50  0001 C CNN
F 1 "+5V" H 5765 6223 50  0000 C CNN
F 2 "" H 5750 6050 50  0001 C CNN
F 3 "" H 5750 6050 50  0001 C CNN
	1    5750 6050
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR0128
U 1 1 5CD9F3C3
P 8500 5350
F 0 "#PWR0128" H 8500 5200 50  0001 C CNN
F 1 "+5V" H 8515 5523 50  0000 C CNN
F 2 "" H 8500 5350 50  0001 C CNN
F 3 "" H 8500 5350 50  0001 C CNN
	1    8500 5350
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR0129
U 1 1 5CD9F42C
P 7100 3800
F 0 "#PWR0129" H 7100 3650 50  0001 C CNN
F 1 "+5V" H 7115 3973 50  0000 C CNN
F 2 "" H 7100 3800 50  0001 C CNN
F 3 "" H 7100 3800 50  0001 C CNN
	1    7100 3800
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR0130
U 1 1 5CD9F8F1
P 10450 1150
F 0 "#PWR0130" H 10450 1000 50  0001 C CNN
F 1 "+5V" H 10465 1323 50  0000 C CNN
F 2 "" H 10450 1150 50  0001 C CNN
F 3 "" H 10450 1150 50  0001 C CNN
	1    10450 1150
	1    0    0    -1  
$EndComp
$Comp
L Regulator_Linear:LP2985-3.3 U3
U 1 1 5CDA1341
P 7700 4050
F 0 "U3" H 7450 4300 50  0000 C CNN
F 1 "LP2985-3.3" H 7950 3800 50  0000 C CNN
F 2 "Package_TO_SOT_SMD:SOT-23-5" H 7700 4375 50  0001 C CNN
F 3 "http://www.ti.com/lit/ds/symlink/lp2985.pdf" H 7700 4050 50  0001 C CNN
	1    7700 4050
	1    0    0    -1  
$EndComp
Wire Wire Line
	8350 3800 8350 3950
Wire Wire Line
	8350 3950 8100 3950
Wire Wire Line
	7100 3950 7100 4050
Wire Wire Line
	7100 4050 7300 4050
Connection ~ 7100 3950
$Comp
L power:+5V #PWR0131
U 1 1 5CDAEDA8
P 6700 3800
F 0 "#PWR0131" H 6700 3650 50  0001 C CNN
F 1 "+5V" H 6715 3973 50  0000 C CNN
F 2 "" H 6700 3800 50  0001 C CNN
F 3 "" H 6700 3800 50  0001 C CNN
	1    6700 3800
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0132
U 1 1 5CDAEDF5
P 6700 4450
F 0 "#PWR0132" H 6700 4200 50  0001 C CNN
F 1 "GND" H 6705 4277 50  0000 C CNN
F 2 "" H 6700 4450 50  0001 C CNN
F 3 "" H 6700 4450 50  0001 C CNN
	1    6700 4450
	1    0    0    -1  
$EndComp
$Comp
L power:+3V3 #PWR0133
U 1 1 5CDAEE42
P 8750 3800
F 0 "#PWR0133" H 8750 3650 50  0001 C CNN
F 1 "+3V3" H 8765 3973 50  0000 C CNN
F 2 "" H 8750 3800 50  0001 C CNN
F 3 "" H 8750 3800 50  0001 C CNN
	1    8750 3800
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0134
U 1 1 5CDAEE8F
P 8750 4450
F 0 "#PWR0134" H 8750 4200 50  0001 C CNN
F 1 "GND" H 8755 4277 50  0000 C CNN
F 2 "" H 8750 4450 50  0001 C CNN
F 3 "" H 8750 4450 50  0001 C CNN
	1    8750 4450
	1    0    0    -1  
$EndComp
Wire Wire Line
	6700 4450 6700 4250
$Comp
L Device:CP1_Small C3
U 1 1 5CDC883D
P 6700 4150
F 0 "C3" H 6791 4196 50  0000 L CNN
F 1 "10uF" H 6791 4105 50  0000 L CNN
F 2 "Capacitor_Tantalum_SMD:CP_EIA-3216-18_Kemet-A_Pad1.58x1.35mm_HandSolder" H 6700 4150 50  0001 C CNN
F 3 "~" H 6700 4150 50  0001 C CNN
	1    6700 4150
	1    0    0    -1  
$EndComp
$Comp
L Device:CP1_Small C6
U 1 1 5CDD58DE
P 8750 4150
F 0 "C6" H 8841 4196 50  0000 L CNN
F 1 "10uF" H 8841 4105 50  0000 L CNN
F 2 "Capacitor_Tantalum_SMD:CP_EIA-3216-18_Kemet-A_Pad1.58x1.35mm_HandSolder" H 8750 4150 50  0001 C CNN
F 3 "~" H 8750 4150 50  0001 C CNN
	1    8750 4150
	1    0    0    -1  
$EndComp
Wire Wire Line
	8750 3800 8750 4050
Wire Wire Line
	8750 4250 8750 4450
$Comp
L Device:CP1_Small C4
U 1 1 5CDDE810
P 7800 1550
F 0 "C4" H 7891 1596 50  0000 L CNN
F 1 "10uF" H 7891 1505 50  0000 L CNN
F 2 "Capacitor_Tantalum_SMD:CP_EIA-3216-18_Kemet-A_Pad1.58x1.35mm_HandSolder" H 7800 1550 50  0001 C CNN
F 3 "~" H 7800 1550 50  0001 C CNN
	1    7800 1550
	1    0    0    -1  
$EndComp
$Comp
L Device:CP1_Small C7
U 1 1 5CDDE87C
P 9700 1550
F 0 "C7" H 9791 1596 50  0000 L CNN
F 1 "10uF" H 9791 1505 50  0000 L CNN
F 2 "Capacitor_Tantalum_SMD:CP_EIA-3216-18_Kemet-A_Pad1.58x1.35mm_HandSolder" H 9700 1550 50  0001 C CNN
F 3 "~" H 9700 1550 50  0001 C CNN
	1    9700 1550
	1    0    0    -1  
$EndComp
Wire Wire Line
	9700 1650 9700 1900
$Comp
L Device:C_Small C8
U 1 1 5CDE7452
P 10200 1550
F 0 "C8" H 10292 1596 50  0000 L CNN
F 1 "0.1uF" H 10292 1505 50  0000 L CNN
F 2 "Capacitor_SMD:C_0603_1608Metric_Pad1.05x0.95mm_HandSolder" H 10200 1550 50  0001 C CNN
F 3 "~" H 10200 1550 50  0001 C CNN
	1    10200 1550
	1    0    0    -1  
$EndComp
Wire Wire Line
	10200 1650 10200 1900
$Comp
L Device:C_Small C2
U 1 1 5CDEC1E8
P 2900 3100
F 0 "C2" V 2671 3100 50  0000 C CNN
F 1 "0.1uF" V 2762 3100 50  0000 C CNN
F 2 "Capacitor_SMD:C_0603_1608Metric_Pad1.05x0.95mm_HandSolder" H 2900 3100 50  0001 C CNN
F 3 "~" H 2900 3100 50  0001 C CNN
	1    2900 3100
	0    1    1    0   
$EndComp
$Comp
L Device:C_Small C1
U 1 1 5CDEC281
P 850 1850
F 0 "C1" H 700 1950 50  0000 L CNN
F 1 "0.1uF" H 600 1750 50  0000 L CNN
F 2 "Capacitor_SMD:C_0603_1608Metric_Pad1.05x0.95mm_HandSolder" H 850 1850 50  0001 C CNN
F 3 "~" H 850 1850 50  0001 C CNN
	1    850  1850
	1    0    0    -1  
$EndComp
Wire Wire Line
	3000 3100 3150 3100
$Comp
L power:GND #PWR0135
U 1 1 5CDFE4AE
P 9250 4450
F 0 "#PWR0135" H 9250 4200 50  0001 C CNN
F 1 "GND" H 9255 4277 50  0000 C CNN
F 2 "" H 9250 4450 50  0001 C CNN
F 3 "" H 9250 4450 50  0001 C CNN
	1    9250 4450
	1    0    0    -1  
$EndComp
Wire Wire Line
	9350 4450 9250 4450
Wire Wire Line
	9350 4150 9250 4150
Wire Wire Line
	9250 4150 9250 4250
Connection ~ 9250 4450
Wire Wire Line
	9350 4350 9250 4350
Connection ~ 9250 4350
Wire Wire Line
	9250 4350 9250 4450
Wire Wire Line
	9350 4250 9250 4250
Connection ~ 9250 4250
Wire Wire Line
	9250 4250 9250 4350
$Comp
L power:+3V3 #PWR0136
U 1 1 5CE10A66
P 9250 3800
F 0 "#PWR0136" H 9250 3650 50  0001 C CNN
F 1 "+3V3" H 9265 3973 50  0000 C CNN
F 2 "" H 9250 3800 50  0001 C CNN
F 3 "" H 9250 3800 50  0001 C CNN
	1    9250 3800
	1    0    0    -1  
$EndComp
Wire Wire Line
	9250 3950 9350 3950
Text GLabel 10700 4050 2    50   Input ~ 0
Z-ACCEL
$Comp
L Connector_Generic:Conn_01x08 J6
U 1 1 5CE34C2D
P 7250 5700
F 0 "J6" H 7250 5200 50  0000 C CNN
F 1 "Other Hemisphere" H 6950 6100 50  0000 C CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_2x04_P2.54mm_Vertical" H 7250 5700 50  0001 C CNN
F 3 "~" H 7250 5700 50  0001 C CNN
	1    7250 5700
	-1   0    0    1   
$EndComp
Wire Wire Line
	8500 5800 7450 5800
$Comp
L power:+3V3 #PWR0137
U 1 1 5CE5D53A
P 8300 5350
F 0 "#PWR0137" H 8300 5200 50  0001 C CNN
F 1 "+3V3" H 8315 5523 50  0000 C CNN
F 2 "" H 8300 5350 50  0001 C CNN
F 3 "" H 8300 5350 50  0001 C CNN
	1    8300 5350
	1    0    0    -1  
$EndComp
Wire Wire Line
	8300 5350 8300 5700
Wire Wire Line
	8300 5700 7450 5700
Text GLabel 7500 5600 2    50   Input ~ 0
Z-ACCEL
Wire Wire Line
	7450 5600 7500 5600
$Comp
L Connector_Generic:Conn_01x08 J1
U 1 1 5CE73098
P 1150 6350
F 0 "J1" H 1150 5850 50  0000 C CNN
F 1 "Other Hemisphere" H 850 6750 50  0000 C CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_2x04_P2.54mm_Vertical" H 1150 6350 50  0001 C CNN
F 3 "~" H 1150 6350 50  0001 C CNN
	1    1150 6350
	-1   0    0    1   
$EndComp
$Comp
L power:+3V3 #PWR0138
U 1 1 5CE8349F
P 2250 6050
F 0 "#PWR0138" H 2250 5900 50  0001 C CNN
F 1 "+3V3" H 2265 6223 50  0000 C CNN
F 2 "" H 2250 6050 50  0001 C CNN
F 3 "" H 2250 6050 50  0001 C CNN
	1    2250 6050
	1    0    0    -1  
$EndComp
Wire Wire Line
	2250 6050 2250 6350
Wire Wire Line
	2250 6350 1350 6350
Text GLabel 1400 6250 2    50   Input ~ 0
Z-ACCEL
Wire Wire Line
	1400 6250 1350 6250
$Comp
L power:+3V3 #PWR0139
U 1 1 5CE8E911
P 850 1450
F 0 "#PWR0139" H 850 1300 50  0001 C CNN
F 1 "+3V3" H 865 1623 50  0000 C CNN
F 2 "" H 850 1450 50  0001 C CNN
F 3 "" H 850 1450 50  0001 C CNN
	1    850  1450
	1    0    0    -1  
$EndComp
Wire Wire Line
	850  1450 850  1600
Connection ~ 850  1600
Wire Wire Line
	850  1600 850  1750
Wire Wire Line
	850  1950 850  2100
Wire Wire Line
	7400 1350 7800 1350
Wire Wire Line
	8500 5800 8500 5350
Wire Wire Line
	9250 3800 9250 3850
Wire Wire Line
	9350 3850 9250 3850
Connection ~ 9250 3850
Wire Wire Line
	9250 3850 9250 3950
$Comp
L power:GND #PWR0120
U 1 1 5C89A864
P 8750 6050
F 0 "#PWR0120" H 8750 5800 50  0001 C CNN
F 1 "GND" H 8755 5877 50  0000 C CNN
F 2 "" H 8750 6050 50  0001 C CNN
F 3 "" H 8750 6050 50  0001 C CNN
	1    8750 6050
	1    0    0    -1  
$EndComp
Wire Wire Line
	8750 6050 8750 6000
Wire Wire Line
	8750 6000 7450 6000
Wire Wire Line
	8800 1900 8800 1750
Wire Wire Line
	2200 7000 2200 6950
Wire Wire Line
	6700 3800 6700 4050
NoConn ~ 2200 2500
NoConn ~ 2200 2600
NoConn ~ 2200 2700
NoConn ~ 2200 2800
NoConn ~ 2200 2900
NoConn ~ 2200 3000
NoConn ~ 2200 3800
NoConn ~ 2200 3900
NoConn ~ 2200 4000
NoConn ~ 2200 1800
NoConn ~ 8100 4050
NoConn ~ 10350 4450
NoConn ~ 9100 1550
NoConn ~ 10350 3950
NoConn ~ 10350 3850
Wire Wire Line
	7400 1350 7400 1150
$Comp
L power:GND #PWR0107
U 1 1 5C92A997
P 5750 6750
F 0 "#PWR0107" H 5750 6500 50  0001 C CNN
F 1 "GND" H 5755 6577 50  0000 C CNN
F 2 "" H 5750 6750 50  0001 C CNN
F 3 "" H 5750 6750 50  0001 C CNN
	1    5750 6750
	1    0    0    -1  
$EndComp
Wire Wire Line
	5750 6750 5750 6550
$Comp
L power:GND #PWR0109
U 1 1 5C931937
P 7800 1900
F 0 "#PWR0109" H 7800 1650 50  0001 C CNN
F 1 "GND" H 7805 1727 50  0000 C CNN
F 2 "" H 7800 1900 50  0001 C CNN
F 3 "" H 7800 1900 50  0001 C CNN
	1    7800 1900
	1    0    0    -1  
$EndComp
Wire Wire Line
	7800 1900 7800 1650
Connection ~ 8300 1350
Wire Wire Line
	8500 1350 8300 1350
Wire Wire Line
	3350 2400 3350 2250
Wire Wire Line
	3350 2250 3250 2250
Wire Wire Line
	8750 5350 8750 5500
$Comp
L power:+BATT #PWR0152
U 1 1 5C91E09E
P 7400 1150
F 0 "#PWR0152" H 7400 1000 50  0001 C CNN
F 1 "+BATT" H 7415 1323 50  0000 C CNN
F 2 "" H 7400 1150 50  0001 C CNN
F 3 "" H 7400 1150 50  0001 C CNN
	1    7400 1150
	1    0    0    -1  
$EndComp
$Comp
L power:+BATT #PWR0153
U 1 1 5C94EDD5
P 8750 5350
F 0 "#PWR0153" H 8750 5200 50  0001 C CNN
F 1 "+BATT" H 8765 5523 50  0000 C CNN
F 2 "" H 8750 5350 50  0001 C CNN
F 3 "" H 8750 5350 50  0001 C CNN
	1    8750 5350
	1    0    0    -1  
$EndComp
$Comp
L MCU_Microchip_ATmega:ATmega328P-AU U2
U 1 1 5C88450F
P 1600 2800
F 0 "U2" H 1150 4250 50  0000 C CNN
F 1 "ATmega328P-AU" H 1950 1350 50  0000 C CNN
F 2 "Package_QFP:TQFP-32_7x7mm_P0.8mm" H 1600 2800 50  0001 C CIN
F 3 "http://ww1.microchip.com/downloads/en/DeviceDoc/ATmega328_P%20AVR%20MCU%20with%20picoPower%20Technology%20Data%20Sheet%2040001984A.pdf" H 1600 2800 50  0001 C CNN
	1    1600 2800
	1    0    0    -1  
$EndComp
Wire Wire Line
	1600 4400 1600 4300
NoConn ~ 1000 1800
NoConn ~ 1000 1900
NoConn ~ 10300 2850
Wire Wire Line
	10300 2850 10200 2850
$Comp
L Device:C C13
U 1 1 5C8AFD46
P 10550 4250
F 0 "C13" H 10450 4350 50  0000 L CNN
F 1 "0.1uF" H 10600 4150 50  0000 L CNN
F 2 "Capacitor_SMD:C_0603_1608Metric_Pad1.05x0.95mm_HandSolder" H 10588 4100 50  0001 C CNN
F 3 "~" H 10550 4250 50  0001 C CNN
	1    10550 4250
	1    0    0    -1  
$EndComp
Wire Wire Line
	10350 4050 10550 4050
Connection ~ 10550 4050
Wire Wire Line
	10550 4050 10700 4050
$Comp
L power:GND #PWR0104
U 1 1 5C8BB071
P 10550 4450
F 0 "#PWR0104" H 10550 4200 50  0001 C CNN
F 1 "GND" H 10555 4277 50  0000 C CNN
F 2 "" H 10550 4450 50  0001 C CNN
F 3 "" H 10550 4450 50  0001 C CNN
	1    10550 4450
	1    0    0    -1  
$EndComp
Wire Wire Line
	10550 4100 10550 4050
Wire Wire Line
	10550 4450 10550 4400
$Comp
L Regulator_Linear:MIC5205YM5 U1
U 1 1 5C8F30DC
P 8800 1450
F 0 "U1" H 8650 1700 50  0000 C CNN
F 1 "MIC5205YM5" H 9050 1200 50  0000 C CNN
F 2 "Package_TO_SOT_SMD:SOT-23-5" H 8800 1775 50  0001 C CNN
F 3 "http://ww1.microchip.com/downloads/en/DeviceDoc/20005785A.pdf" H 8800 1450 50  0001 C CNN
	1    8800 1450
	1    0    0    -1  
$EndComp
$EndSCHEMATC
