EESchema Schematic File Version 4
LIBS:node-cache
EELAYER 29 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 2 3
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
L Device:Resonator_Small Y?
U 1 1 5C94FC82
P 6300 3050
AR Path="/5C94FC82" Ref="Y?"  Part="1" 
AR Path="/5C920754/5C94FC82" Ref="Y1"  Part="1" 
F 0 "Y1" V 6350 3200 50  0000 L CNN
F 1 "16MHz" V 6250 3200 50  0000 L CNN
F 2 "Crystal:Resonator_SMD_muRata_CSTxExxV-3Pin_3.0x1.1mm" H 6275 3050 50  0001 C CNN
F 3 "~" H 6275 3050 50  0001 C CNN
F 4 "CSTCE16M0V53-R0" H 0   0   50  0001 C CNN "MPN"
F 5 "CSTCE16M0V53-R0" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "1" H 0   0   50  0001 C CNN "Min Quantity"
	1    6300 3050
	0    -1   -1   0   
$EndComp
Wire Wire Line
	5850 3100 5850 3150
Wire Wire Line
	5850 3150 6200 3150
Wire Wire Line
	5850 3000 5850 2950
Wire Wire Line
	5850 2950 6200 2950
$Comp
L power:GND #PWR?
U 1 1 5C94FC8C
P 6700 3050
AR Path="/5C94FC8C" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C94FC8C" Ref="#PWR022"  Part="1" 
F 0 "#PWR022" H 6700 2800 50  0001 C CNN
F 1 "GND" H 6705 2877 50  0000 C CNN
F 2 "" H 6700 3050 50  0001 C CNN
F 3 "" H 6700 3050 50  0001 C CNN
	1    6700 3050
	1    0    0    -1  
$EndComp
Wire Wire Line
	6500 3050 6700 3050
$Comp
L power:+5V #PWR?
U 1 1 5C94FC93
P 4650 2050
AR Path="/5C94FC93" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C94FC93" Ref="#PWR018"  Part="1" 
F 0 "#PWR018" H 4650 1900 50  0001 C CNN
F 1 "+5V" H 4665 2223 50  0000 C CNN
F 2 "" H 4650 2050 50  0001 C CNN
F 3 "" H 4650 2050 50  0001 C CNN
	1    4650 2050
	1    0    0    -1  
$EndComp
$Comp
L power:+3V3 #PWR?
U 1 1 5C94FCA7
P 3700 2400
AR Path="/5C94FCA7" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C94FCA7" Ref="#PWR011"  Part="1" 
F 0 "#PWR011" H 3700 2250 50  0001 C CNN
F 1 "+3V3" H 3715 2573 50  0000 C CNN
F 2 "" H 3700 2400 50  0001 C CNN
F 3 "" H 3700 2400 50  0001 C CNN
	1    3700 2400
	1    0    0    -1  
$EndComp
$Comp
L Device:C_Small C?
U 1 1 5C94FCAE
P 3700 2500
AR Path="/5C94FCAE" Ref="C?"  Part="1" 
AR Path="/5C920754/5C94FCAE" Ref="C5"  Part="1" 
F 0 "C5" H 3792 2546 50  0000 L CNN
F 1 "0.1u" H 3792 2455 50  0000 L CNN
F 2 "Capacitor_SMD:C_0402_1005Metric" H 3700 2500 50  0001 C CNN
F 3 "~" H 3700 2500 50  0001 C CNN
F 4 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "MPN"
F 5 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "50" H 0   0   50  0001 C CNN "Min Quantity"
	1    3700 2500
	1    0    0    -1  
$EndComp
Connection ~ 3700 2400
$Comp
L power:GND #PWR?
U 1 1 5C94FCB5
P 3700 2600
AR Path="/5C94FCB5" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C94FCB5" Ref="#PWR012"  Part="1" 
F 0 "#PWR012" H 3700 2350 50  0001 C CNN
F 1 "GND" H 3705 2427 50  0000 C CNN
F 2 "" H 3700 2600 50  0001 C CNN
F 3 "" H 3700 2600 50  0001 C CNN
	1    3700 2600
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR?
U 1 1 5C94FCBB
P 3700 3250
AR Path="/5C94FCBB" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C94FCBB" Ref="#PWR013"  Part="1" 
F 0 "#PWR013" H 3700 3100 50  0001 C CNN
F 1 "+5V" H 3715 3423 50  0000 C CNN
F 2 "" H 3700 3250 50  0001 C CNN
F 3 "" H 3700 3250 50  0001 C CNN
	1    3700 3250
	1    0    0    -1  
$EndComp
Wire Wire Line
	5850 4500 6100 4500
$Comp
L Device:R_Small_US R?
U 1 1 5C94FCCA
P 5750 4500
AR Path="/5C94FCCA" Ref="R?"  Part="1" 
AR Path="/5C920754/5C94FCCA" Ref="R2"  Part="1" 
F 0 "R2" V 5700 4350 50  0000 C CNN
F 1 "470R" V 5700 4700 50  0000 C CNN
F 2 "Resistor_SMD:R_0402_1005Metric" H 5750 4500 50  0001 C CNN
F 3 "~" H 5750 4500 50  0001 C CNN
F 4 "0402WGF4700TCE" H 0   0   50  0001 C CNN "MPN"
F 5 "0402WGF4700TCE" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "100" H 0   0   50  0001 C CNN "Min Quantity"
	1    5750 4500
	0    1    1    0   
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C94FCD0
P 3700 3450
AR Path="/5C94FCD0" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C94FCD0" Ref="#PWR014"  Part="1" 
F 0 "#PWR014" H 3700 3200 50  0001 C CNN
F 1 "GND" H 3705 3277 50  0000 C CNN
F 2 "" H 3700 3450 50  0001 C CNN
F 3 "" H 3700 3450 50  0001 C CNN
	1    3700 3450
	1    0    0    -1  
$EndComp
$Comp
L Device:C_Small C?
U 1 1 5C94FCD6
P 3700 3350
AR Path="/5C94FCD6" Ref="C?"  Part="1" 
AR Path="/5C920754/5C94FCD6" Ref="C6"  Part="1" 
F 0 "C6" H 3792 3396 50  0000 L CNN
F 1 "0.1u" H 3792 3305 50  0000 L CNN
F 2 "Capacitor_SMD:C_0402_1005Metric" H 3700 3350 50  0001 C CNN
F 3 "~" H 3700 3350 50  0001 C CNN
F 4 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "MPN"
F 5 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "50" H 0   0   50  0001 C CNN "Min Quantity"
	1    3700 3350
	1    0    0    -1  
$EndComp
Wire Wire Line
	6250 3900 6300 3900
$Comp
L Device:C_Small C?
U 1 1 5C94FD16
P 6150 3900
AR Path="/5C94FD16" Ref="C?"  Part="1" 
AR Path="/5C920754/5C94FD16" Ref="C7"  Part="1" 
F 0 "C7" V 5921 3900 50  0000 C CNN
F 1 "0.1u" V 6012 3900 50  0000 C CNN
F 2 "Capacitor_SMD:C_0402_1005Metric" H 6150 3900 50  0001 C CNN
F 3 "~" H 6150 3900 50  0001 C CNN
F 4 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "MPN"
F 5 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "50" H 0   0   50  0001 C CNN "Min Quantity"
	1    6150 3900
	0    1    1    0   
$EndComp
Wire Wire Line
	4600 2050 4650 2050
Wire Wire Line
	4650 2050 4700 2050
Connection ~ 4650 2050
Connection ~ 2950 1050
Wire Wire Line
	2750 1050 2950 1050
Connection ~ 1950 1050
Wire Wire Line
	1950 1150 1950 1050
Wire Wire Line
	1700 1050 1950 1050
$Comp
L Regulator_Linear:LP2985-5.0 U?
U 1 1 5C956666
P 2350 1150
AR Path="/5C956666" Ref="U?"  Part="1" 
AR Path="/5C920754/5C956666" Ref="U2"  Part="1" 
F 0 "U2" H 2350 1492 50  0000 C CNN
F 1 "LP2985-5.0" H 2350 1401 50  0000 C CNN
F 2 "Package_TO_SOT_SMD:SOT-23-5" H 2350 1475 50  0001 C CNN
F 3 "http://www.ti.com/lit/ds/symlink/lp2985.pdf" H 2350 1150 50  0001 C CNN
F 4 "LP2985AIM5-5.0/NOPB" H 0   0   50  0001 C CNN "MPN"
F 5 "LP2985AIM5-5.0/NOPB" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "1" H 0   0   50  0001 C CNN "Min Quantity"
	1    2350 1150
	1    0    0    -1  
$EndComp
Connection ~ 1850 2100
Wire Wire Line
	1850 2100 1850 2300
Connection ~ 3050 2100
Wire Wire Line
	2650 2100 3050 2100
Wire Wire Line
	1550 2100 1850 2100
$Comp
L OPL_Integrated_Circuit:PMIC-LDO-XC6204B332MR_SOT23-5_ U?
U 1 1 5C956673
P 2250 2200
AR Path="/5C956673" Ref="U?"  Part="1" 
AR Path="/5C920754/5C956673" Ref="U1"  Part="1" 
F 0 "U1" H 2250 2554 45  0000 C CNN
F 1 "PMIC-LDO-XC6204B332MR_SOT23-5_" H 2250 2470 45  0000 C CNN
F 2 "Package_TO_SOT_SMD:SOT-23-5" H 2250 2200 50  0001 C CNN
F 3 "" H 2250 2200 50  0001 C CNN
F 4 "XC6204B332MR" H 2280 2350 20  0001 C CNN "MPN"
F 5 "310030046" H 2280 2350 20  0001 C CNN "SKU"
F 6 "Seeed" H 0   0   50  0001 C CNN "OPL"
F 7 "1" H 0   0   50  0001 C CNN "Min Quantity"
	1    2250 2200
	1    0    0    -1  
$EndComp
Text Label 1550 2100 0    50   ~ 0
VIN
Text Label 1700 1050 0    50   ~ 0
VIN
$Comp
L Device:C_Small C?
U 1 1 5C95667C
P 1700 1200
AR Path="/5C95667C" Ref="C?"  Part="1" 
AR Path="/5C920754/5C95667C" Ref="C2"  Part="1" 
F 0 "C2" H 1792 1291 50  0000 L CNN
F 1 "1u" H 1792 1200 50  0000 L CNN
F 2 "Capacitor_SMD:C_0603_1608Metric" H 1700 1200 50  0001 C CNN
F 3 "~" H 1700 1200 50  0001 C CNN
F 4 "10V" H 1792 1109 50  0000 L CNN "Vrating"
F 5 "CC0402KRX5R6BB105        " H 0   0   50  0001 C CNN "MPN"
F 6 "CC0402KRX5R6BB105        " H 0   0   50  0001 C CNN "SKU"
F 7 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 8 "50" H 0   0   50  0001 C CNN "Min Quantity"
	1    1700 1200
	1    0    0    -1  
$EndComp
$Comp
L Device:C_Small C?
U 1 1 5C956683
P 2950 1200
AR Path="/5C956683" Ref="C?"  Part="1" 
AR Path="/5C920754/5C956683" Ref="C3"  Part="1" 
F 0 "C3" H 3042 1291 50  0000 L CNN
F 1 "1u" H 3042 1200 50  0000 L CNN
F 2 "Capacitor_SMD:C_0603_1608Metric" H 2950 1200 50  0001 C CNN
F 3 "~" H 2950 1200 50  0001 C CNN
F 4 "10V" H 3042 1109 50  0000 L CNN "Vrating"
F 5 "CC0402KRX5R6BB105        " H 0   0   50  0001 C CNN "MPN"
F 6 "CC0402KRX5R6BB105        " H 0   0   50  0001 C CNN "SKU"
F 7 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 8 "50" H 0   0   50  0001 C CNN "Min Quantity"
	1    2950 1200
	1    0    0    -1  
$EndComp
$Comp
L Device:C_Small C?
U 1 1 5C95668A
P 3050 2250
AR Path="/5C95668A" Ref="C?"  Part="1" 
AR Path="/5C920754/5C95668A" Ref="C4"  Part="1" 
F 0 "C4" H 3142 2341 50  0000 L CNN
F 1 "1u" H 3142 2250 50  0000 L CNN
F 2 "Capacitor_SMD:C_0603_1608Metric" H 3050 2250 50  0001 C CNN
F 3 "~" H 3050 2250 50  0001 C CNN
F 4 "10V" H 3142 2159 50  0000 L CNN "Vrating"
F 5 "CC0402KRX5R6BB105        " H 0   0   50  0001 C CNN "MPN"
F 6 "CC0402KRX5R6BB105        " H 0   0   50  0001 C CNN "SKU"
F 7 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 8 "50" H 0   0   50  0001 C CNN "Min Quantity"
	1    3050 2250
	1    0    0    -1  
$EndComp
Wire Wire Line
	1550 2400 1550 2350
Wire Wire Line
	1550 2150 1550 2100
Wire Wire Line
	3050 2150 3050 2100
Wire Wire Line
	3050 2400 3050 2350
Wire Wire Line
	2950 1350 2950 1300
Wire Wire Line
	2950 1100 2950 1050
Wire Wire Line
	1700 1350 1700 1300
Wire Wire Line
	1700 1100 1700 1050
$Comp
L Device:C_Small C?
U 1 1 5C956699
P 1550 2250
AR Path="/5C956699" Ref="C?"  Part="1" 
AR Path="/5C920754/5C956699" Ref="C1"  Part="1" 
F 0 "C1" H 1642 2341 50  0000 L CNN
F 1 "1u" H 1642 2250 50  0000 L CNN
F 2 "Capacitor_SMD:C_0603_1608Metric" H 1550 2250 50  0001 C CNN
F 3 "~" H 1550 2250 50  0001 C CNN
F 4 "10V" H 1642 2159 50  0000 L CNN "Vrating"
F 5 "CC0402KRX5R6BB105        " H 0   0   50  0001 C CNN "MPN"
F 6 "CC0402KRX5R6BB105        " H 0   0   50  0001 C CNN "SKU"
F 7 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 8 "50" H 0   0   50  0001 C CNN "Min Quantity"
	1    1550 2250
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C95669F
P 1700 1350
AR Path="/5C95669F" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C95669F" Ref="#PWR02"  Part="1" 
F 0 "#PWR02" H 1700 1100 50  0001 C CNN
F 1 "GND" H 1705 1177 50  0000 C CNN
F 2 "" H 1700 1350 50  0001 C CNN
F 3 "" H 1700 1350 50  0001 C CNN
	1    1700 1350
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C9566A5
P 2950 1350
AR Path="/5C9566A5" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9566A5" Ref="#PWR08"  Part="1" 
F 0 "#PWR08" H 2950 1100 50  0001 C CNN
F 1 "GND" H 2955 1177 50  0000 C CNN
F 2 "" H 2950 1350 50  0001 C CNN
F 3 "" H 2950 1350 50  0001 C CNN
	1    2950 1350
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C9566AB
P 3050 2400
AR Path="/5C9566AB" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9566AB" Ref="#PWR010"  Part="1" 
F 0 "#PWR010" H 3050 2150 50  0001 C CNN
F 1 "GND" H 3055 2227 50  0000 C CNN
F 2 "" H 3050 2400 50  0001 C CNN
F 3 "" H 3050 2400 50  0001 C CNN
	1    3050 2400
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C9566B1
P 1550 2400
AR Path="/5C9566B1" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9566B1" Ref="#PWR01"  Part="1" 
F 0 "#PWR01" H 1550 2150 50  0001 C CNN
F 1 "GND" H 1555 2227 50  0000 C CNN
F 2 "" H 1550 2400 50  0001 C CNN
F 3 "" H 1550 2400 50  0001 C CNN
	1    1550 2400
	1    0    0    -1  
$EndComp
$Comp
L power:+3V3 #PWR?
U 1 1 5C9566B7
P 3050 2100
AR Path="/5C9566B7" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9566B7" Ref="#PWR09"  Part="1" 
F 0 "#PWR09" H 3050 1950 50  0001 C CNN
F 1 "+3V3" H 3065 2273 50  0000 C CNN
F 2 "" H 3050 2100 50  0001 C CNN
F 3 "" H 3050 2100 50  0001 C CNN
	1    3050 2100
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR?
U 1 1 5C9566BD
P 2950 1050
AR Path="/5C9566BD" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9566BD" Ref="#PWR07"  Part="1" 
F 0 "#PWR07" H 2950 900 50  0001 C CNN
F 1 "+5V" H 2965 1223 50  0000 C CNN
F 2 "" H 2950 1050 50  0001 C CNN
F 3 "" H 2950 1050 50  0001 C CNN
	1    2950 1050
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C9566C3
P 2250 2550
AR Path="/5C9566C3" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9566C3" Ref="#PWR05"  Part="1" 
F 0 "#PWR05" H 2250 2300 50  0001 C CNN
F 1 "GND" H 2255 2377 50  0000 C CNN
F 2 "" H 2250 2550 50  0001 C CNN
F 3 "" H 2250 2550 50  0001 C CNN
	1    2250 2550
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C9566C9
P 2350 1450
AR Path="/5C9566C9" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9566C9" Ref="#PWR06"  Part="1" 
F 0 "#PWR06" H 2350 1200 50  0001 C CNN
F 1 "GND" H 2355 1277 50  0000 C CNN
F 2 "" H 2350 1450 50  0001 C CNN
F 3 "" H 2350 1450 50  0001 C CNN
	1    2350 1450
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR?
U 1 1 5C95CB94
P 7800 3950
AR Path="/5C95CB94" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C95CB94" Ref="#PWR027"  Part="1" 
F 0 "#PWR027" H 7800 3800 50  0001 C CNN
F 1 "+5V" H 7815 4123 50  0000 C CNN
F 2 "" H 7800 3950 50  0001 C CNN
F 3 "" H 7800 3950 50  0001 C CNN
	1    7800 3950
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR?
U 1 1 5C95CB9A
P 8750 3950
AR Path="/5C95CB9A" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C95CB9A" Ref="#PWR029"  Part="1" 
F 0 "#PWR029" H 8750 3800 50  0001 C CNN
F 1 "+5V" H 8765 4123 50  0000 C CNN
F 2 "" H 8750 3950 50  0001 C CNN
F 3 "" H 8750 3950 50  0001 C CNN
	1    8750 3950
	1    0    0    -1  
$EndComp
$Comp
L Device:C_Small C?
U 1 1 5C95CBA0
P 8150 4150
AR Path="/5C95CBA0" Ref="C?"  Part="1" 
AR Path="/5C920754/5C95CBA0" Ref="C9"  Part="1" 
F 0 "C9" H 8242 4196 50  0000 L CNN
F 1 "0.1u" H 8242 4105 50  0000 L CNN
F 2 "Capacitor_SMD:C_0402_1005Metric" H 8150 4150 50  0001 C CNN
F 3 "~" H 8150 4150 50  0001 C CNN
F 4 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "MPN"
F 5 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "50" H 0   0   50  0001 C CNN "Min Quantity"
	1    8150 4150
	1    0    0    -1  
$EndComp
$Comp
L Device:C_Small C?
U 1 1 5C95CBA6
P 9100 4150
AR Path="/5C95CBA6" Ref="C?"  Part="1" 
AR Path="/5C920754/5C95CBA6" Ref="C11"  Part="1" 
F 0 "C11" H 9192 4196 50  0000 L CNN
F 1 "0.1u" H 9192 4105 50  0000 L CNN
F 2 "Capacitor_SMD:C_0402_1005Metric" H 9100 4150 50  0001 C CNN
F 3 "~" H 9100 4150 50  0001 C CNN
F 4 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "MPN"
F 5 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "50" H 0   0   50  0001 C CNN "Min Quantity"
	1    9100 4150
	1    0    0    -1  
$EndComp
Wire Wire Line
	9350 4400 9050 4400
Wire Wire Line
	7400 4400 7500 4400
$Comp
L power:GND #PWR?
U 1 1 5C95CBC8
P 8750 4800
AR Path="/5C95CBC8" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C95CBC8" Ref="#PWR030"  Part="1" 
F 0 "#PWR030" H 8750 4550 50  0001 C CNN
F 1 "GND" H 8755 4627 50  0000 C CNN
F 2 "" H 8750 4800 50  0001 C CNN
F 3 "" H 8750 4800 50  0001 C CNN
	1    8750 4800
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C95CBCE
P 7800 4800
AR Path="/5C95CBCE" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C95CBCE" Ref="#PWR028"  Part="1" 
F 0 "#PWR028" H 7800 4550 50  0001 C CNN
F 1 "GND" H 7805 4627 50  0000 C CNN
F 2 "" H 7800 4800 50  0001 C CNN
F 3 "" H 7800 4800 50  0001 C CNN
	1    7800 4800
	1    0    0    -1  
$EndComp
Wire Wire Line
	8100 4400 8450 4400
$Comp
L LED:NeoPixel_THT D?
U 1 1 5C95CBD5
P 8750 4400
AR Path="/5C95CBD5" Ref="D?"  Part="1" 
AR Path="/5C920754/5C95CBD5" Ref="D3"  Part="1" 
F 0 "D3" H 8550 4650 50  0000 L CNN
F 1 "LED 2" H 8800 4150 50  0000 L CNN
F 2 "node:WS2812D-F5" H 8800 4100 50  0001 L TNN
F 3 "https://www.adafruit.com/product/1938" H 8850 4025 50  0001 L TNN
F 4 "1938" H 0   0   50  0001 C CNN "MPN"
F 5 "1528-1959-ND	" H 0   0   50  0001 C CNN "SKU"
F 6 "5" H 0   0   50  0001 C CNN "Min Quantity"
	1    8750 4400
	1    0    0    -1  
$EndComp
$Comp
L LED:NeoPixel_THT D?
U 1 1 5C95CBDB
P 7800 4400
AR Path="/5C95CBDB" Ref="D?"  Part="1" 
AR Path="/5C920754/5C95CBDB" Ref="D2"  Part="1" 
F 0 "D2" H 7600 4650 50  0000 L CNN
F 1 "LED 1" H 7850 4150 50  0000 L CNN
F 2 "node:WS2812D-F5" H 7850 4100 50  0001 L TNN
F 3 "https://www.adafruit.com/product/1938" H 7900 4025 50  0001 L TNN
F 4 "1938" H 0   0   50  0001 C CNN "MPN"
F 5 "1528-1959-ND	" H 0   0   50  0001 C CNN "SKU"
F 6 "5" H 0   0   50  0001 C CNN "Min Quantity"
	1    7800 4400
	1    0    0    -1  
$EndComp
Wire Wire Line
	7800 3950 7800 4050
Wire Wire Line
	7800 4050 8150 4050
Connection ~ 7800 4050
Wire Wire Line
	7800 4050 7800 4100
Wire Wire Line
	7800 4750 8150 4750
Wire Wire Line
	8150 4750 8150 4250
Wire Wire Line
	7800 4700 7800 4750
Connection ~ 7800 4750
Wire Wire Line
	7800 4750 7800 4800
Wire Wire Line
	8750 4100 8750 4050
Wire Wire Line
	8750 4050 9100 4050
Connection ~ 8750 4050
Wire Wire Line
	8750 4050 8750 3950
Wire Wire Line
	8750 4800 8750 4750
Wire Wire Line
	8750 4750 9100 4750
Wire Wire Line
	9100 4750 9100 4250
Connection ~ 8750 4750
Wire Wire Line
	8750 4750 8750 4700
Text Label 6100 4500 0    50   ~ 0
DIN-TOP
Text Label 7400 4400 2    50   ~ 0
DIN-TOP
$Comp
L power:GND #PWR?
U 1 1 5C971076
P 7300 3150
AR Path="/5C971076" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C971076" Ref="#PWR024"  Part="1" 
F 0 "#PWR024" H 7300 2900 50  0001 C CNN
F 1 "GND" H 7305 2977 50  0000 C CNN
F 2 "" H 7300 3150 50  0001 C CNN
F 3 "" H 7300 3150 50  0001 C CNN
	1    7300 3150
	1    0    0    -1  
$EndComp
$Comp
L power:+3V3 #PWR?
U 1 1 5C97107C
P 7300 2950
AR Path="/5C97107C" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C97107C" Ref="#PWR023"  Part="1" 
F 0 "#PWR023" H 7300 2800 50  0001 C CNN
F 1 "+3V3" H 7315 3123 50  0000 C CNN
F 2 "" H 7300 2950 50  0001 C CNN
F 3 "" H 7300 2950 50  0001 C CNN
	1    7300 2950
	1    0    0    -1  
$EndComp
$Comp
L Device:C_Small C?
U 1 1 5C971082
P 7300 3050
AR Path="/5C971082" Ref="C?"  Part="1" 
AR Path="/5C920754/5C971082" Ref="C8"  Part="1" 
F 0 "C8" H 7392 3096 50  0000 L CNN
F 1 "0.1u" H 7392 3005 50  0000 L CNN
F 2 "Capacitor_SMD:C_0402_1005Metric" H 7300 3050 50  0001 C CNN
F 3 "~" H 7300 3050 50  0001 C CNN
F 4 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "MPN"
F 5 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "50" H 0   0   50  0001 C CNN "Min Quantity"
	1    7300 3050
	1    0    0    -1  
$EndComp
$Comp
L power:+3V3 #PWR?
U 1 1 5C97108B
P 7650 2750
AR Path="/5C97108B" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C97108B" Ref="#PWR025"  Part="1" 
F 0 "#PWR025" H 7650 2600 50  0001 C CNN
F 1 "+3V3" H 7665 2923 50  0000 C CNN
F 2 "" H 7650 2750 50  0001 C CNN
F 3 "" H 7650 2750 50  0001 C CNN
	1    7650 2750
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C971097
P 7650 3450
AR Path="/5C971097" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C971097" Ref="#PWR026"  Part="1" 
F 0 "#PWR026" H 7650 3200 50  0001 C CNN
F 1 "GND" H 7655 3277 50  0000 C CNN
F 2 "" H 7650 3450 50  0001 C CNN
F 3 "" H 7650 3450 50  0001 C CNN
	1    7650 3450
	1    0    0    -1  
$EndComp
Connection ~ 8950 3050
Wire Wire Line
	9100 3050 8950 3050
$Comp
L power:GND #PWR?
U 1 1 5C9710A0
P 8950 3350
AR Path="/5C9710A0" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9710A0" Ref="#PWR031"  Part="1" 
F 0 "#PWR031" H 8950 3100 50  0001 C CNN
F 1 "GND" H 8955 3177 50  0000 C CNN
F 2 "" H 8950 3350 50  0001 C CNN
F 3 "" H 8950 3350 50  0001 C CNN
	1    8950 3350
	1    0    0    -1  
$EndComp
Wire Wire Line
	8950 3050 8950 3150
Wire Wire Line
	8650 3050 8950 3050
$Comp
L Device:C_Small C?
U 1 1 5C9710A8
P 8950 3250
AR Path="/5C9710A8" Ref="C?"  Part="1" 
AR Path="/5C920754/5C9710A8" Ref="C10"  Part="1" 
F 0 "C10" H 9042 3296 50  0000 L CNN
F 1 "0.1u" H 9042 3205 50  0000 L CNN
F 2 "Capacitor_SMD:C_0402_1005Metric" H 8950 3250 50  0001 C CNN
F 3 "~" H 8950 3250 50  0001 C CNN
F 4 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "MPN"
F 5 "VJ0402G104KXQCW1BC" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "50" H 0   0   50  0001 C CNN "Min Quantity"
	1    8950 3250
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C9734D3
P 1550 3400
AR Path="/5C9734D3" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9734D3" Ref="#PWR04"  Part="1" 
F 0 "#PWR04" H 1550 3150 50  0001 C CNN
F 1 "GND" H 1555 3227 50  0000 C CNN
F 2 "" H 1550 3400 50  0001 C CNN
F 3 "" H 1550 3400 50  0001 C CNN
	1    1550 3400
	1    0    0    -1  
$EndComp
$Comp
L Connector_Generic:Conn_01x06 J?
U 1 1 5C9734D9
P 2250 3600
AR Path="/5C9734D9" Ref="J?"  Part="1" 
AR Path="/5C920754/5C9734D9" Ref="J2"  Part="1" 
F 0 "J2" H 2330 3592 50  0000 L CNN
F 1 "TC2030_NL" H 2330 3501 50  0000 L CNN
F 2 "Connector:Tag-Connect_TC2030-IDC-NL_2x03_P1.27mm_Vertical" H 2250 3600 50  0001 C CNN
F 3 "http://www.tag-connect.com/TC2030-MCP-NL" H 2250 3600 50  0001 C CNN
	1    2250 3600
	1    0    0    -1  
$EndComp
Text HLabel 4000 6950 0    50   UnSpc ~ 0
GNDT
Text HLabel 4000 6550 0    50   UnSpc ~ 0
BATT-BOT
Text Label 1250 2250 0    50   ~ 0
VIN
$Comp
L Diode:BAT54CW D?
U 1 1 5C995166
P 1050 2250
AR Path="/5C995166" Ref="D?"  Part="1" 
AR Path="/5C920754/5C995166" Ref="D1"  Part="1" 
F 0 "D1" V 1096 2337 50  0000 L CNN
F 1 "BAT54CW" V 1005 2337 50  0000 L CNN
F 2 "Package_TO_SOT_SMD:SOT-323_SC-70" H 1125 2375 50  0001 L CNN
F 3 "https://assets.nexperia.com/documents/data-sheet/BAT54W_SER.pdf" H 970 2250 50  0001 C CNN
F 4 "BAT54C-7-F" H 0   0   50  0001 C CNN "MPN"
F 5 "BAT54C-7-F" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "20" H 0   0   50  0001 C CNN "Min Quantity"
	1    1050 2250
	0    -1   -1   0   
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C99C622
P 4800 1350
AR Path="/5C99C622" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C99C622" Ref="#PWR020"  Part="1" 
F 0 "#PWR020" H 4800 1100 50  0001 C CNN
F 1 "GND" H 4805 1177 50  0000 C CNN
F 2 "" H 4800 1350 50  0001 C CNN
F 3 "" H 4800 1350 50  0001 C CNN
	1    4800 1350
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C99C628
P 4800 900
AR Path="/5C99C628" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C99C628" Ref="#PWR019"  Part="1" 
F 0 "#PWR019" H 4800 650 50  0001 C CNN
F 1 "GND" H 4805 727 50  0000 C CNN
F 2 "" H 4800 900 50  0001 C CNN
F 3 "" H 4800 900 50  0001 C CNN
	1    4800 900 
	1    0    0    -1  
$EndComp
$Comp
L Connector_Generic:Conn_01x02 J?
U 1 1 5C99C62E
P 5000 1250
AR Path="/5C99C62E" Ref="J?"  Part="1" 
AR Path="/5C920754/5C99C62E" Ref="J5"  Part="1" 
F 0 "J5" H 5080 1242 50  0000 L CNN
F 1 "Port_2" H 5080 1151 50  0000 L CNN
F 2 "node:port" H 5000 1250 50  0001 C CNN
F 3 "~" H 5000 1250 50  0001 C CNN
	1    5000 1250
	1    0    0    -1  
$EndComp
$Comp
L Connector_Generic:Conn_01x02 J?
U 1 1 5C99C634
P 5000 800
AR Path="/5C99C634" Ref="J?"  Part="1" 
AR Path="/5C920754/5C99C634" Ref="J4"  Part="1" 
F 0 "J4" H 5080 792 50  0000 L CNN
F 1 "Port_1" H 5080 701 50  0000 L CNN
F 2 "node:port" H 5000 800 50  0001 C CNN
F 3 "~" H 5000 800 50  0001 C CNN
	1    5000 800 
	1    0    0    -1  
$EndComp
Text Label 1050 1950 2    50   ~ 0
BATT
Text Label 4500 800  0    50   ~ 0
BNC-1
Text Label 4500 1250 0    50   ~ 0
BNC-2
Wire Wire Line
	4500 800  4800 800 
Wire Wire Line
	4800 1250 4500 1250
Text Label 2050 3800 2    50   ~ 0
MOSI
Text Label 2050 3700 2    50   ~ 0
MISO
Text Label 2050 3600 2    50   ~ 0
SCK
Text Label 2050 3500 2    50   ~ 0
~RST
Text Label 5550 2700 0    50   ~ 0
MOSI
Text Label 5550 2800 0    50   ~ 0
MISO
Text Label 5550 2900 0    50   ~ 0
SCK
Wire Wire Line
	5200 3100 5850 3100
Wire Wire Line
	5200 3000 5850 3000
Wire Wire Line
	4600 2100 4600 2050
Wire Wire Line
	5200 4300 5550 4300
Wire Wire Line
	5200 4200 5550 4200
Wire Wire Line
	5550 4100 5200 4100
Wire Wire Line
	5200 3300 5550 3300
$Comp
L power:GND #PWR?
U 1 1 5C94FD1C
P 4600 5100
AR Path="/5C94FD1C" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C94FD1C" Ref="#PWR017"  Part="1" 
F 0 "#PWR017" H 4600 4850 50  0001 C CNN
F 1 "GND" H 4605 4927 50  0000 C CNN
F 2 "" H 4600 5100 50  0001 C CNN
F 3 "" H 4600 5100 50  0001 C CNN
	1    4600 5100
	1    0    0    -1  
$EndComp
Wire Wire Line
	3700 2400 4000 2400
Wire Wire Line
	5200 4500 5650 4500
Wire Wire Line
	4700 2050 4700 2100
Wire Wire Line
	5550 2900 5200 2900
Wire Wire Line
	5200 2800 5550 2800
Wire Wire Line
	5200 2700 5550 2700
Wire Wire Line
	5200 2500 5550 2500
Wire Wire Line
	5550 2400 5200 2400
Wire Wire Line
	5550 4400 5200 4400
Text Label 5350 3900 0    50   ~ 0
~RST
Text Label 5550 2400 0    50   ~ 0
BNC-3
Text Label 5550 2500 0    50   ~ 0
BNC-4
Text Label 5550 3300 0    50   ~ 0
Z-ACCEL
Text Label 5550 4100 0    50   ~ 0
RXI
Text Label 5550 4200 0    50   ~ 0
TXO
Text Label 5550 4300 0    50   ~ 0
BNC-1
Text Label 5550 4400 0    50   ~ 0
BNC-2
Text Label 6300 3900 0    50   ~ 0
DTR
Text Label 2300 5050 0    50   ~ 0
DTR
Text Label 2300 4950 0    50   ~ 0
RXI
Text Label 2300 5150 0    50   ~ 0
TXO
$Comp
L power:GND #PWR?
U 1 1 5C9D7E71
P 2000 5350
AR Path="/5C9D7E71" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9D7E71" Ref="#PWR03"  Part="1" 
F 0 "#PWR03" H 2000 5100 50  0001 C CNN
F 1 "GND" H 2005 5177 50  0000 C CNN
F 2 "" H 2000 5350 50  0001 C CNN
F 3 "" H 2000 5350 50  0001 C CNN
	1    2000 5350
	1    0    0    -1  
$EndComp
Wire Wire Line
	5200 3900 5700 3900
Wire Wire Line
	5700 3900 6050 3900
Connection ~ 5700 3900
$Comp
L Device:R_Small_US R?
U 1 1 5C94FD10
P 5700 3750
AR Path="/5C94FD10" Ref="R?"  Part="1" 
AR Path="/5C920754/5C94FD10" Ref="R1"  Part="1" 
F 0 "R1" H 5768 3796 50  0000 L CNN
F 1 "10K" H 5768 3705 50  0000 L CNN
F 2 "Resistor_SMD:R_0402_1005Metric" H 5700 3750 50  0001 C CNN
F 3 "~" H 5700 3750 50  0001 C CNN
F 4 "RC0402JR-0710KL	" H 0   0   50  0001 C CNN "MPN"
F 5 "RC0402JR-0710KL	" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "100" H 0   0   50  0001 C CNN "Min Quantity"
	1    5700 3750
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR?
U 1 1 5C94FD09
P 5700 3650
AR Path="/5C94FD09" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C94FD09" Ref="#PWR021"  Part="1" 
F 0 "#PWR021" H 5700 3500 50  0001 C CNN
F 1 "+5V" H 5715 3823 50  0000 C CNN
F 2 "" H 5700 3650 50  0001 C CNN
F 3 "" H 5700 3650 50  0001 C CNN
	1    5700 3650
	1    0    0    -1  
$EndComp
Wire Wire Line
	5700 3900 5700 3850
$Comp
L power:GND #PWR?
U 1 1 5C9EE097
P 4100 6950
AR Path="/5C9EE097" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9EE097" Ref="#PWR015"  Part="1" 
F 0 "#PWR015" H 4100 6700 50  0001 C CNN
F 1 "GND" H 4105 6777 50  0000 C CNN
F 2 "" H 4100 6950 50  0001 C CNN
F 3 "" H 4100 6950 50  0001 C CNN
	1    4100 6950
	1    0    0    -1  
$EndComp
Text Label 2300 4750 0    50   ~ 0
+5V_EXT
Text Label 950  2550 2    50   ~ 0
+5V_EXT
Wire Wire Line
	950  2550 1050 2550
Text Label 2050 3900 2    50   ~ 0
+5V_EXT
Text HLabel 4000 6650 0    50   Input ~ 0
BNC-3
Text HLabel 4000 6750 0    50   Input ~ 0
BNC-4
$Comp
L Device:Battery_Cell BT?
U 1 1 5CA04C70
P 1000 1300
AR Path="/5CA04C70" Ref="BT?"  Part="1" 
AR Path="/5C920CA4/5CA04C70" Ref="BT?"  Part="1" 
AR Path="/5C920754/5CA04C70" Ref="BT1"  Part="1" 
F 0 "BT1" H 1118 1396 50  0000 L CNN
F 1 "CR2032" H 1118 1305 50  0000 L CNN
F 2 "gsg-modules:BK-912" V 1000 1360 50  0001 C CNN
F 3 "http://www.memoryprotectiondevices.com/datasheets/BK-912-datasheet.pdf" V 1000 1360 50  0001 C CNN
F 4 "BK-912" H 0   0   50  0001 C CNN "MPN"
F 5 "1" H 0   0   50  0001 C CNN "Min Quantity"
	1    1000 1300
	1    0    0    -1  
$EndComp
Text Label 600  1100 0    50   ~ 0
BATT
Text Label 600  1400 0    50   ~ 0
BATT-BOT
Wire Wire Line
	600  1100 1000 1100
Wire Wire Line
	1000 1400 600  1400
Text Label 4100 6550 0    50   ~ 0
BATT-BOT
Text Label 4100 6750 0    50   ~ 0
BNC-4
Text Label 4100 6650 0    50   ~ 0
BNC-3
Text Label 9100 3050 0    50   ~ 0
Z-ACCEL
Text Label 9350 4400 0    50   ~ 0
DOUT-BOT
Text Label 4100 6850 0    50   ~ 0
DOUT-BOT
Text HLabel 4000 6850 0    50   Output ~ 0
DOUT-BOT
Wire Wire Line
	4000 6950 4100 6950
Wire Wire Line
	4000 6550 4550 6550
Wire Wire Line
	4000 6650 4550 6650
Wire Wire Line
	4000 6750 4550 6750
Wire Wire Line
	4000 6850 4550 6850
Wire Wire Line
	4550 6950 4100 6950
Connection ~ 4100 6950
$Comp
L power:+5V #PWR?
U 1 1 5CA49F4A
P 4550 6450
AR Path="/5CA49F4A" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5CA49F4A" Ref="#PWR016"  Part="1" 
F 0 "#PWR016" H 4550 6300 50  0001 C CNN
F 1 "+5V" H 4565 6623 50  0000 C CNN
F 2 "" H 4550 6450 50  0001 C CNN
F 3 "" H 4550 6450 50  0001 C CNN
	1    4550 6450
	1    0    0    -1  
$EndComp
$Comp
L Connector_Generic:Conn_01x06 J?
U 1 1 5CA4C1CB
P 4750 6650
AR Path="/5CA4C1CB" Ref="J?"  Part="1" 
AR Path="/5C920754/5CA4C1CB" Ref="J3"  Part="1" 
F 0 "J3" H 4830 6642 50  0000 L CNN
F 1 "FFC-0.5MM-6POS" H 4830 6551 50  0000 L CNN
F 2 "Connector_FFC-FPC:Hirose_FH12-6S-0.5SH_1x06-1MP_P0.50mm_Horizontal" H 4750 6650 50  0001 C CNN
F 3 "http://file.elecfans.com/web1/M00/58/C8/o4YBAFte0lKAMHKmAAy2rm8BovQ141.pdf" H 4750 6650 50  0001 C CNN
F 4 "FH12-6S-0.5SH(55)" H 0   0   50  0001 C CNN "MPN"
F 5 "FH12-6S-0.5SH(55)" H 0   0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 0   0   50  0001 C CNN "OPL"
F 7 "1" H 0   0   50  0001 C CNN "Min Quantity"
	1    4750 6650
	1    0    0    -1  
$EndComp
Text HLabel 4000 6450 0    50   Output ~ 0
5VOUT
Wire Wire Line
	4000 6450 4550 6450
Connection ~ 4550 6450
$Comp
L Connector:USB_B_Mini J1
U 1 1 5CA5B90D
P 2000 4950
F 0 "J1" H 2057 5417 50  0000 C CNN
F 1 "USB_B_Mini" H 2057 5326 50  0000 C CNN
F 2 "Connector_USB:USB_Mini-B_Lumberg_2486_01_Horizontal" H 2150 4900 50  0001 C CNN
F 3 "http://www.hqchip.com/uploads/goods/201712/1513300237267023233.pdf" H 2150 4900 50  0001 C CNN
F 4 "U-M-M5SS-W-2	" H 150 0   50  0001 C CNN "MPN"
F 5 "U-M-M5SS-W-2	" H 150 0   50  0001 C CNN "SKU"
F 6 "Shenzhen" H 150 0   50  0001 C CNN "OPL"
	1    2000 4950
	1    0    0    -1  
$EndComp
$Comp
L MCU_Microchip_ATmega:ATmega328P-MU U3
U 1 1 5CAD6264
P 4600 3600
F 0 "U3" H 4150 5050 50  0000 C CNN
F 1 "ATmega328P-MU" H 4950 2150 50  0000 C CNN
F 2 "Package_DFN_QFN:QFN-32-1EP_5x5mm_P0.5mm_EP3.1x3.1mm" H 4600 3600 50  0001 C CIN
F 3 "http://ww1.microchip.com/downloads/en/DeviceDoc/ATmega328_P%20AVR%20MCU%20with%20picoPower%20Technology%20Data%20Sheet%2040001984A.pdf" H 4600 3600 50  0001 C CNN
F 4 "ATMEGA328P-MU	" H 0   0   50  0001 C CNN "MPN"
F 5 "310010005" H 0   0   50  0001 C CNN "Min Quantity"
F 6 "Seeed" H 0   0   50  0001 C CNN "OPL"
	1    4600 3600
	1    0    0    -1  
$EndComp
Wire Wire Line
	1550 3400 2050 3400
Wire Wire Line
	1900 5350 2000 5350
Connection ~ 2000 5350
NoConn ~ 8650 2850
NoConn ~ 8650 2950
NoConn ~ 8650 3250
Wire Wire Line
	7650 2750 7650 2850
$Comp
L SparkFun-Sensors:ADXL337 U4
U 1 1 5C9C6311
P 8150 3050
F 0 "U4" H 8150 3610 45  0000 C CNN
F 1 "ADXL337" H 8150 3526 45  0000 C CNN
F 2 "Package_CSP:LFCSP-16-1EP_3x3mm_P0.5mm_EP1.6x1.6mm" H 8150 3450 20  0001 C CNN
F 3 "" H 8150 3050 60  0001 C CNN
F 4 "IC-12011" H 8150 3431 60  0000 C CNN "Field4"
	1    8150 3050
	1    0    0    -1  
$EndComp
Wire Wire Line
	7650 2950 7650 2850
Connection ~ 7650 2850
Wire Wire Line
	7650 3150 7650 3250
Connection ~ 7650 3250
Wire Wire Line
	7650 3250 7650 3450
$EndSCHEMATC
