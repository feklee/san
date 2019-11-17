EESchema Schematic File Version 4
LIBS:board-cache
EELAYER 30 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title "SAN"
Date ""
Rev "v0.1"
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 "Author: Felix E. Klee <felix.klee@inka.de>"
$EndDescr
$Comp
L SparkFun-Boards:ARDUINO_PRO_MINI B?
U 1 1 5DD15878
P 2300 2800
F 0 "B?" H 2300 3754 45  0000 C CNN
F 1 "ARDUINO_PRO_MINI" H 2300 3670 45  0000 C CNN
F 2 "ARDUINO_PRO_MINI" H 2300 3750 20  0001 C CNN
F 3 "" H 2300 2800 50  0001 C CNN
F 4 "XXX-00000" H 2300 3681 60  0001 C CNN "Field4"
	1    2300 2800
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5DD1EFE2
P 975 2625
F 0 "#PWR?" H 975 2375 50  0001 C CNN
F 1 "GND" H 980 2452 50  0000 C CNN
F 2 "" H 975 2625 50  0001 C CNN
F 3 "" H 975 2625 50  0001 C CNN
	1    975  2625
	1    0    0    -1  
$EndComp
$Comp
L Connector_Generic:Conn_01x03 Port4
U 1 1 5DD282FD
P 4825 4350
F 0 "Port4" H 4905 4392 50  0000 L CNN
F 1 "Conn_01x03" H 4905 4301 50  0000 L CNN
F 2 "" H 4825 4350 50  0001 C CNN
F 3 "~" H 4825 4350 50  0001 C CNN
	1    4825 4350
	1    0    0    -1  
$EndComp
$Comp
L Connector_Generic:Conn_01x03 Port3
U 1 1 5DD28E2E
P 4825 4825
F 0 "Port3" H 4905 4867 50  0000 L CNN
F 1 "Conn_01x03" H 4905 4776 50  0000 L CNN
F 2 "" H 4825 4825 50  0001 C CNN
F 3 "~" H 4825 4825 50  0001 C CNN
	1    4825 4825
	1    0    0    -1  
$EndComp
$Comp
L Connector_Generic:Conn_01x03 Port2
U 1 1 5DD2916A
P 4825 5275
F 0 "Port2" H 4905 5317 50  0000 L CNN
F 1 "Conn_01x03" H 4905 5226 50  0000 L CNN
F 2 "" H 4825 5275 50  0001 C CNN
F 3 "~" H 4825 5275 50  0001 C CNN
	1    4825 5275
	1    0    0    -1  
$EndComp
$Comp
L Connector_Generic:Conn_01x03 Port1
U 1 1 5DD2997A
P 4825 5700
F 0 "Port1" H 4905 5742 50  0000 L CNN
F 1 "Conn_01x03" H 4905 5651 50  0000 L CNN
F 2 "" H 4825 5700 50  0001 C CNN
F 3 "~" H 4825 5700 50  0001 C CNN
	1    4825 5700
	1    0    0    -1  
$EndComp
$Comp
L Device:R_Small_US R?
U 1 1 5DD29F2D
P 8350 3425
F 0 "R?" H 8325 3325 50  0000 R CNN
F 1 "1.7k" H 8325 3525 50  0000 R CNN
F 2 "" H 8350 3425 50  0001 C CNN
F 3 "~" H 8350 3425 50  0001 C CNN
	1    8350 3425
	-1   0    0    1   
$EndComp
$Comp
L Connector_Generic:Conn_01x06 ESP-EYE
U 1 1 5DD2B3B7
P 10400 3650
F 0 "ESP-EYE" H 10480 3642 50  0000 L CNN
F 1 "Conn_01x06" H 10480 3551 50  0000 L CNN
F 2 "" H 10400 3650 50  0001 C CNN
F 3 "~" H 10400 3650 50  0001 C CNN
	1    10400 3650
	1    0    0    -1  
$EndComp
$Comp
L Connector_Generic:Conn_01x02 J?
U 1 1 5DD2BB76
P 5475 1500
F 0 "J?" H 5555 1492 50  0000 L CNN
F 1 "Conn_01x02" H 5555 1401 50  0000 L CNN
F 2 "" H 5475 1500 50  0001 C CNN
F 3 "~" H 5475 1500 50  0001 C CNN
	1    5475 1500
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR?
U 1 1 5DD2A9D0
P 2900 2375
F 0 "#PWR?" H 2900 2225 50  0001 C CNN
F 1 "+5V" H 3025 2425 50  0000 C CNN
F 2 "" H 2900 2375 50  0001 C CNN
F 3 "" H 2900 2375 50  0001 C CNN
	1    2900 2375
	1    0    0    -1  
$EndComp
Wire Wire Line
	2900 2375 2900 2400
Wire Wire Line
	2900 2400 2750 2400
$Comp
L power:GND #PWR?
U 1 1 5DD3224E
P 3225 2300
F 0 "#PWR?" H 3225 2050 50  0001 C CNN
F 1 "GND" H 3375 2225 50  0000 C CNN
F 2 "" H 3225 2300 50  0001 C CNN
F 3 "" H 3225 2300 50  0001 C CNN
	1    3225 2300
	1    0    0    -1  
$EndComp
Wire Wire Line
	3225 2200 3225 2300
Wire Wire Line
	2750 2200 3225 2200
Wire Wire Line
	4625 4350 4500 4350
Wire Wire Line
	4500 4350 4500 4825
Wire Wire Line
	4625 4825 4500 4825
Connection ~ 4500 4825
Wire Wire Line
	4500 4825 4500 5275
Wire Wire Line
	4625 5275 4500 5275
Connection ~ 4500 5275
Wire Wire Line
	4500 5275 4500 5700
Wire Wire Line
	4625 5700 4500 5700
Connection ~ 4500 5700
Wire Wire Line
	4500 5700 4500 6000
$Comp
L power:GND #PWR?
U 1 1 5DD34B8B
P 4500 6000
F 0 "#PWR?" H 4500 5750 50  0001 C CNN
F 1 "GND" H 4505 5827 50  0000 C CNN
F 2 "" H 4500 6000 50  0001 C CNN
F 3 "" H 4500 6000 50  0001 C CNN
	1    4500 6000
	1    0    0    -1  
$EndComp
Wire Wire Line
	2750 2800 3200 2800
Wire Wire Line
	3200 5800 4625 5800
Wire Wire Line
	2750 2700 3475 2700
Wire Wire Line
	3475 2700 3475 3400
Wire Wire Line
	3475 5375 4625 5375
Wire Wire Line
	2750 2600 3750 2600
Wire Wire Line
	3750 2600 3750 3400
Wire Wire Line
	3750 4925 4625 4925
Wire Wire Line
	2750 2500 4025 2500
Wire Wire Line
	4025 2500 4025 3400
Wire Wire Line
	4025 4450 4625 4450
Wire Wire Line
	1300 5600 4625 5600
Wire Wire Line
	1400 5175 4625 5175
Wire Wire Line
	1500 4725 4625 4725
Wire Wire Line
	1600 4250 4625 4250
$Comp
L Connector_Generic:Conn_01x03 Neopixels
U 1 1 5DD52EAB
P 6775 3875
F 0 "Neopixels" H 6855 3917 50  0000 L CNN
F 1 "Conn_01x03" H 6855 3826 50  0000 L CNN
F 2 "" H 6775 3875 50  0001 C CNN
F 3 "~" H 6775 3875 50  0001 C CNN
	1    6775 3875
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5DD53728
P 6475 4150
F 0 "#PWR?" H 6475 3900 50  0001 C CNN
F 1 "GND" H 6625 4075 50  0000 C CNN
F 2 "" H 6475 4150 50  0001 C CNN
F 3 "" H 6475 4150 50  0001 C CNN
	1    6475 4150
	1    0    0    -1  
$EndComp
Wire Wire Line
	6575 3875 6475 3875
Wire Wire Line
	6475 3875 6475 4150
$Comp
L power:+5V #PWR?
U 1 1 5DD5583D
P 6350 3650
F 0 "#PWR?" H 6350 3500 50  0001 C CNN
F 1 "+5V" H 6225 3700 50  0000 C CNN
F 2 "" H 6350 3650 50  0001 C CNN
F 3 "" H 6350 3650 50  0001 C CNN
	1    6350 3650
	1    0    0    -1  
$EndComp
Wire Wire Line
	6350 3975 6575 3975
Wire Wire Line
	6350 3975 6350 3650
Wire Wire Line
	1850 2700 1700 2700
Wire Wire Line
	1700 2700 1700 3775
Wire Wire Line
	1700 3775 6575 3775
$Comp
L power:+5V #PWR?
U 1 1 5DD62987
P 9750 3300
F 0 "#PWR?" H 9750 3150 50  0001 C CNN
F 1 "+5V" H 9875 3350 50  0000 C CNN
F 2 "" H 9750 3300 50  0001 C CNN
F 3 "" H 9750 3300 50  0001 C CNN
	1    9750 3300
	1    0    0    -1  
$EndComp
Wire Wire Line
	10200 3450 9750 3450
Wire Wire Line
	9750 3300 9750 3450
$Comp
L power:GND #PWR?
U 1 1 5DD647B8
P 9750 4700
F 0 "#PWR?" H 9750 4450 50  0001 C CNN
F 1 "GND" H 9900 4625 50  0000 C CNN
F 2 "" H 9750 4700 50  0001 C CNN
F 3 "" H 9750 4700 50  0001 C CNN
	1    9750 4700
	1    0    0    -1  
$EndComp
Wire Wire Line
	9750 3550 9750 4525
Wire Wire Line
	9750 3550 10200 3550
Wire Wire Line
	2750 3200 8350 3200
Wire Wire Line
	8350 3200 8350 3325
$Comp
L Device:R_Small_US R?
U 1 1 5DD78F8D
P 8350 4250
F 0 "R?" H 8325 4150 50  0000 R CNN
F 1 "3.3k" H 8325 4350 50  0000 R CNN
F 2 "" H 8350 4250 50  0001 C CNN
F 3 "~" H 8350 4250 50  0001 C CNN
	1    8350 4250
	-1   0    0    1   
$EndComp
Wire Wire Line
	8350 3525 8350 3650
Wire Wire Line
	10200 3650 8350 3650
Connection ~ 8350 3650
Wire Wire Line
	8350 3650 8350 4150
Wire Wire Line
	8350 4350 8350 4525
Connection ~ 9750 4525
Wire Wire Line
	9750 4525 9750 4700
Wire Wire Line
	2750 3100 8725 3100
Wire Wire Line
	8725 3100 8725 3325
Wire Wire Line
	2750 3000 9450 3000
Wire Wire Line
	9450 3000 9450 3950
Wire Wire Line
	9450 3950 10200 3950
Wire Wire Line
	2750 2900 9100 2900
Wire Wire Line
	9100 2900 9100 3325
$Comp
L Device:R_Small_US R?
U 1 1 5DD8C49F
P 8725 3425
F 0 "R?" H 8700 3325 50  0000 R CNN
F 1 "1.7k" H 8700 3525 50  0000 R CNN
F 2 "" H 8725 3425 50  0001 C CNN
F 3 "~" H 8725 3425 50  0001 C CNN
	1    8725 3425
	-1   0    0    1   
$EndComp
$Comp
L Device:R_Small_US R?
U 1 1 5DD8C79E
P 9100 3425
F 0 "R?" H 9075 3325 50  0000 R CNN
F 1 "1.7k" H 9075 3525 50  0000 R CNN
F 2 "" H 9100 3425 50  0001 C CNN
F 3 "~" H 9100 3425 50  0001 C CNN
	1    9100 3425
	-1   0    0    1   
$EndComp
$Comp
L Device:R_Small_US R?
U 1 1 5DD92DEF
P 8725 4250
F 0 "R?" H 8700 4150 50  0000 R CNN
F 1 "3.3k" H 8700 4350 50  0000 R CNN
F 2 "" H 8725 4250 50  0001 C CNN
F 3 "~" H 8725 4250 50  0001 C CNN
	1    8725 4250
	-1   0    0    1   
$EndComp
$Comp
L Device:R_Small_US R?
U 1 1 5DD93275
P 9100 4250
F 0 "R?" H 9075 4150 50  0000 R CNN
F 1 "3.3k" H 9075 4350 50  0000 R CNN
F 2 "" H 9100 4250 50  0001 C CNN
F 3 "~" H 9100 4250 50  0001 C CNN
	1    9100 4250
	-1   0    0    1   
$EndComp
Wire Wire Line
	8725 3525 8725 3850
Wire Wire Line
	9100 3525 9100 3750
Wire Wire Line
	8725 4350 8725 4525
Wire Wire Line
	8350 4525 8725 4525
Connection ~ 8725 4525
Wire Wire Line
	8725 4525 9100 4525
Wire Wire Line
	9100 4350 9100 4525
Connection ~ 9100 4525
Wire Wire Line
	9100 4525 9750 4525
Wire Wire Line
	10200 3850 8725 3850
Connection ~ 8725 3850
Wire Wire Line
	8725 3850 8725 4150
Wire Wire Line
	10200 3750 9100 3750
Connection ~ 9100 3750
Wire Wire Line
	9100 3750 9100 4150
$Comp
L Device:R_Small_US R?
U 1 1 5DD0D9EE
P 3200 3500
F 0 "R?" H 3175 3400 50  0000 R CNN
F 1 "1k" H 3175 3600 50  0000 R CNN
F 2 "" H 3200 3500 50  0001 C CNN
F 3 "~" H 3200 3500 50  0001 C CNN
	1    3200 3500
	-1   0    0    1   
$EndComp
Wire Wire Line
	3200 2800 3200 3400
Wire Wire Line
	3200 3600 3200 5800
$Comp
L Device:R_Small_US R?
U 1 1 5DD2E8C5
P 3475 3500
F 0 "R?" H 3450 3400 50  0000 R CNN
F 1 "1k" H 3450 3600 50  0000 R CNN
F 2 "" H 3475 3500 50  0001 C CNN
F 3 "~" H 3475 3500 50  0001 C CNN
	1    3475 3500
	-1   0    0    1   
$EndComp
Wire Wire Line
	3475 3600 3475 5375
$Comp
L Device:R_Small_US R?
U 1 1 5DD2EB95
P 3750 3500
F 0 "R?" H 3725 3400 50  0000 R CNN
F 1 "1k" H 3725 3600 50  0000 R CNN
F 2 "" H 3750 3500 50  0001 C CNN
F 3 "~" H 3750 3500 50  0001 C CNN
	1    3750 3500
	-1   0    0    1   
$EndComp
Wire Wire Line
	3750 3600 3750 4925
$Comp
L Device:R_Small_US R?
U 1 1 5DD2EDDB
P 4025 3500
F 0 "R?" H 4000 3400 50  0000 R CNN
F 1 "1k" H 4000 3600 50  0000 R CNN
F 2 "" H 4025 3500 50  0001 C CNN
F 3 "~" H 4025 3500 50  0001 C CNN
	1    4025 3500
	-1   0    0    1   
$EndComp
Wire Wire Line
	4025 3600 4025 4450
Wire Wire Line
	1850 2500 1300 2500
Wire Wire Line
	1300 2500 1300 5600
Wire Wire Line
	1850 2400 975  2400
Wire Wire Line
	975  2400 975  2625
Wire Wire Line
	1850 2600 1400 2600
Wire Wire Line
	1400 2600 1400 5175
Wire Wire Line
	1850 3100 1500 3100
Wire Wire Line
	1500 3100 1500 4725
Wire Wire Line
	1850 3200 1600 3200
Wire Wire Line
	1600 3200 1600 4250
$EndSCHEMATC
