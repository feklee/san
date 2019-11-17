EESchema Schematic File Version 4
LIBS:board-cache
EELAYER 30 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title "SAN Port"
Date ""
Rev "v0.1"
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 "Author: Felix E. Klee <felix.klee@inka.de>"
$EndDescr
$Comp
L Connector_Generic:Conn_01x03 Port1
U 1 1 5DD3FB84
P 6950 3650
F 0 "Port1" H 7030 3692 50  0000 L CNN
F 1 "Conn_01x03" H 7030 3601 50  0000 L CNN
F 2 "" H 6950 3650 50  0001 C CNN
F 3 "~" H 6950 3650 50  0001 C CNN
	1    6950 3650
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR0101
U 1 1 5DD404C3
P 4700 4150
F 0 "#PWR0101" H 4700 3900 50  0001 C CNN
F 1 "GND" H 4850 4075 50  0000 C CNN
F 2 "" H 4700 4150 50  0001 C CNN
F 3 "" H 4700 4150 50  0001 C CNN
	1    4700 4150
	1    0    0    -1  
$EndComp
$Comp
L Device:LED D1
U 1 1 5DD4274E
P 5825 3750
F 0 "D1" H 5975 3600 50  0000 C CNN
F 1 "TSAL6100" H 5450 3600 50  0000 C CNN
F 2 "" H 5825 3750 50  0001 C CNN
F 3 "~" H 5825 3750 50  0001 C CNN
	1    5825 3750
	1    0    0    -1  
$EndComp
$Comp
L Device:Q_Photo_NPN Q1
U 1 1 5DD430F4
P 5850 3450
F 0 "Q1" V 5825 3625 50  0000 L CNN
F 1 "LTR-4206E" V 5825 2850 50  0000 L CNN
F 2 "" H 6050 3550 50  0001 C CNN
F 3 "~" H 5850 3450 50  0001 C CNN
	1    5850 3450
	0    1    1    0   
$EndComp
Wire Wire Line
	6750 3650 4700 3650
Wire Wire Line
	4700 3650 4700 3750
Wire Wire Line
	5975 3750 6750 3750
Wire Wire Line
	5675 3750 4700 3750
Connection ~ 4700 3750
Wire Wire Line
	4700 3750 4700 4150
Wire Wire Line
	6050 3550 6750 3550
Wire Wire Line
	5650 3550 4700 3550
Wire Wire Line
	4700 3550 4700 3650
Connection ~ 4700 3650
$EndSCHEMATC
