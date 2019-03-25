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
Connection ~ 2500 2400
Wire Wire Line
	2300 2400 2500 2400
Connection ~ 1500 2400
Wire Wire Line
	1500 2500 1500 2400
Wire Wire Line
	1250 2400 1500 2400
$Comp
L Regulator_Linear:LP2985-5.0 U?
U 1 1 5C956666
P 1900 2500
AR Path="/5C956666" Ref="U?"  Part="1" 
AR Path="/5C920754/5C956666" Ref="U2"  Part="1" 
F 0 "U2" H 1900 2842 50  0000 C CNN
F 1 "LP2985-5.0" H 1900 2751 50  0000 C CNN
F 2 "Package_TO_SOT_SMD:SOT-23-5" H 1900 2825 50  0001 C CNN
F 3 "http://www.ti.com/lit/ds/symlink/lp2985.pdf" H 1900 2500 50  0001 C CNN
F 4 "LP2985AIM5-5.0/NOPB" H -450 1350 50  0001 C CNN "MPN"
F 5 "LP2985AIM5-5.0/NOPB" H -450 1350 50  0001 C CNN "SKU"
F 6 "Shenzhen" H -450 1350 50  0001 C CNN "OPL"
F 7 "1" H -450 1350 50  0001 C CNN "Min Quantity"
	1    1900 2500
	1    0    0    -1  
$EndComp
Text Label 1250 2400 0    50   ~ 0
VIN
$Comp
L Device:C_Small C?
U 1 1 5C95667C
P 1250 2600
AR Path="/5C95667C" Ref="C?"  Part="1" 
AR Path="/5C920754/5C95667C" Ref="C2"  Part="1" 
F 0 "C2" H 1342 2691 50  0000 L CNN
F 1 "1u" H 1342 2600 50  0000 L CNN
F 2 "Capacitor_SMD:C_0603_1608Metric" H 1250 2600 50  0001 C CNN
F 3 "~" H 1250 2600 50  0001 C CNN
F 4 "10V" H 1342 2509 50  0000 L CNN "Vrating"
F 5 "CC0402KRX5R6BB105        " H -450 1400 50  0001 C CNN "MPN"
F 6 "CC0402KRX5R6BB105        " H -450 1400 50  0001 C CNN "SKU"
F 7 "Shenzhen" H -450 1400 50  0001 C CNN "OPL"
F 8 "50" H -450 1400 50  0001 C CNN "Min Quantity"
	1    1250 2600
	1    0    0    -1  
$EndComp
$Comp
L Device:C_Small C?
U 1 1 5C956683
P 2500 2600
AR Path="/5C956683" Ref="C?"  Part="1" 
AR Path="/5C920754/5C956683" Ref="C3"  Part="1" 
F 0 "C3" H 2592 2691 50  0000 L CNN
F 1 "1u" H 2592 2600 50  0000 L CNN
F 2 "Capacitor_SMD:C_0603_1608Metric" H 2500 2600 50  0001 C CNN
F 3 "~" H 2500 2600 50  0001 C CNN
F 4 "10V" H 2587 2512 50  0000 L CNN "Vrating"
F 5 "CC0402KRX5R6BB105        " H -450 1400 50  0001 C CNN "MPN"
F 6 "CC0402KRX5R6BB105        " H -450 1400 50  0001 C CNN "SKU"
F 7 "Shenzhen" H -450 1400 50  0001 C CNN "OPL"
F 8 "50" H -450 1400 50  0001 C CNN "Min Quantity"
	1    2500 2600
	1    0    0    1   
$EndComp
$Comp
L Device:C_Small C?
U 1 1 5C95668A
P 2725 4375
AR Path="/5C95668A" Ref="C?"  Part="1" 
AR Path="/5C920754/5C95668A" Ref="C4"  Part="1" 
F 0 "C4" H 2817 4466 50  0000 L CNN
F 1 "1u" H 2817 4375 50  0000 L CNN
F 2 "Capacitor_SMD:C_0603_1608Metric" H 2725 4375 50  0001 C CNN
F 3 "~" H 2725 4375 50  0001 C CNN
F 4 "10V" H 2817 4284 50  0000 L CNN "Vrating"
F 5 "CC0402KRX5R6BB105        " H -325 2125 50  0001 C CNN "MPN"
F 6 "CC0402KRX5R6BB105        " H -325 2125 50  0001 C CNN "SKU"
F 7 "Shenzhen" H -325 2125 50  0001 C CNN "OPL"
F 8 "50" H -325 2125 50  0001 C CNN "Min Quantity"
	1    2725 4375
	1    0    0    -1  
$EndComp
Wire Wire Line
	2500 2800 2500 2700
Wire Wire Line
	2500 2500 2500 2400
Wire Wire Line
	1250 2800 1250 2700
Wire Wire Line
	1250 2500 1250 2400
$Comp
L power:GND #PWR?
U 1 1 5C95669F
P 1250 2800
AR Path="/5C95669F" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C95669F" Ref="#PWR02"  Part="1" 
F 0 "#PWR02" H 1250 2550 50  0001 C CNN
F 1 "GND" H 1255 2627 50  0000 C CNN
F 2 "" H 1250 2800 50  0001 C CNN
F 3 "" H 1250 2800 50  0001 C CNN
	1    1250 2800
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C9566A5
P 2500 2800
AR Path="/5C9566A5" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9566A5" Ref="#PWR08"  Part="1" 
F 0 "#PWR08" H 2500 2550 50  0001 C CNN
F 1 "GND" H 2505 2627 50  0000 C CNN
F 2 "" H 2500 2800 50  0001 C CNN
F 3 "" H 2500 2800 50  0001 C CNN
	1    2500 2800
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C9566B1
P 1250 4650
AR Path="/5C9566B1" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9566B1" Ref="#PWR01"  Part="1" 
F 0 "#PWR01" H 1250 4400 50  0001 C CNN
F 1 "GND" H 1255 4477 50  0000 C CNN
F 2 "" H 1250 4650 50  0001 C CNN
F 3 "" H 1250 4650 50  0001 C CNN
	1    1250 4650
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR?
U 1 1 5C9566BD
P 2850 2400
AR Path="/5C9566BD" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9566BD" Ref="#PWR07"  Part="1" 
F 0 "#PWR07" H 2850 2250 50  0001 C CNN
F 1 "+5V" H 2865 2573 50  0000 C CNN
F 2 "" H 2850 2400 50  0001 C CNN
F 3 "" H 2850 2400 50  0001 C CNN
	1    2850 2400
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C9566C9
P 1900 2800
AR Path="/5C9566C9" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9566C9" Ref="#PWR06"  Part="1" 
F 0 "#PWR06" H 1900 2550 50  0001 C CNN
F 1 "GND" H 1905 2627 50  0000 C CNN
F 2 "" H 1900 2800 50  0001 C CNN
F 3 "" H 1900 2800 50  0001 C CNN
	1    1900 2800
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR?
U 1 1 5C95CB94
P 8025 4050
AR Path="/5C95CB94" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C95CB94" Ref="#PWR027"  Part="1" 
F 0 "#PWR027" H 8025 3900 50  0001 C CNN
F 1 "+5V" H 8040 4223 50  0000 C CNN
F 2 "" H 8025 4050 50  0001 C CNN
F 3 "" H 8025 4050 50  0001 C CNN
	1    8025 4050
	1    0    0    -1  
$EndComp
$Comp
L power:+5V #PWR?
U 1 1 5C95CB9A
P 9400 4050
AR Path="/5C95CB9A" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C95CB9A" Ref="#PWR029"  Part="1" 
F 0 "#PWR029" H 9400 3900 50  0001 C CNN
F 1 "+5V" H 9415 4223 50  0000 C CNN
F 2 "" H 9400 4050 50  0001 C CNN
F 3 "" H 9400 4050 50  0001 C CNN
	1    9400 4050
	1    0    0    -1  
$EndComp
$Comp
L Device:C_Small C?
U 1 1 5C95CBA0
P 8650 4250
AR Path="/5C95CBA0" Ref="C?"  Part="1" 
AR Path="/5C920754/5C95CBA0" Ref="C9"  Part="1" 
F 0 "C9" H 8742 4296 50  0000 L CNN
F 1 "0.1u" H 8742 4205 50  0000 L CNN
F 2 "Capacitor_SMD:C_0402_1005Metric" H 8650 4250 50  0001 C CNN
F 3 "~" H 8650 4250 50  0001 C CNN
F 4 "VJ0402G104KXQCW1BC" H 500 100 50  0001 C CNN "MPN"
F 5 "VJ0402G104KXQCW1BC" H 500 100 50  0001 C CNN "SKU"
F 6 "Shenzhen" H 500 100 50  0001 C CNN "OPL"
F 7 "50" H 500 100 50  0001 C CNN "Min Quantity"
	1    8650 4250
	1    0    0    -1  
$EndComp
$Comp
L Device:C_Small C?
U 1 1 5C95CBA6
P 10025 4250
AR Path="/5C95CBA6" Ref="C?"  Part="1" 
AR Path="/5C920754/5C95CBA6" Ref="C11"  Part="1" 
F 0 "C11" H 10117 4296 50  0000 L CNN
F 1 "0.1u" H 10117 4205 50  0000 L CNN
F 2 "Capacitor_SMD:C_0402_1005Metric" H 10025 4250 50  0001 C CNN
F 3 "~" H 10025 4250 50  0001 C CNN
F 4 "VJ0402G104KXQCW1BC" H 925 100 50  0001 C CNN "MPN"
F 5 "VJ0402G104KXQCW1BC" H 925 100 50  0001 C CNN "SKU"
F 6 "Shenzhen" H 925 100 50  0001 C CNN "OPL"
F 7 "50" H 925 100 50  0001 C CNN "Min Quantity"
	1    10025 4250
	1    0    0    -1  
$EndComp
Wire Wire Line
	7625 4500 7725 4500
$Comp
L power:GND #PWR?
U 1 1 5C95CBC8
P 9400 4900
AR Path="/5C95CBC8" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C95CBC8" Ref="#PWR030"  Part="1" 
F 0 "#PWR030" H 9400 4650 50  0001 C CNN
F 1 "GND" H 9405 4727 50  0000 C CNN
F 2 "" H 9400 4900 50  0001 C CNN
F 3 "" H 9400 4900 50  0001 C CNN
	1    9400 4900
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C95CBCE
P 8025 4900
AR Path="/5C95CBCE" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C95CBCE" Ref="#PWR028"  Part="1" 
F 0 "#PWR028" H 8025 4650 50  0001 C CNN
F 1 "GND" H 8030 4727 50  0000 C CNN
F 2 "" H 8025 4900 50  0001 C CNN
F 3 "" H 8025 4900 50  0001 C CNN
	1    8025 4900
	1    0    0    -1  
$EndComp
Wire Wire Line
	8325 4500 9100 4500
Wire Wire Line
	8025 4050 8025 4150
Wire Wire Line
	8025 4150 8650 4150
Connection ~ 8025 4150
Wire Wire Line
	8025 4150 8025 4200
Wire Wire Line
	8025 4850 8650 4850
Wire Wire Line
	8650 4850 8650 4350
Wire Wire Line
	8025 4800 8025 4850
Connection ~ 8025 4850
Wire Wire Line
	8025 4850 8025 4900
Wire Wire Line
	9400 4200 9400 4150
Wire Wire Line
	9400 4150 10025 4150
Connection ~ 9400 4150
Wire Wire Line
	9400 4150 9400 4050
Wire Wire Line
	9400 4900 9400 4850
Wire Wire Line
	9400 4850 10025 4850
Wire Wire Line
	10025 4850 10025 4350
Connection ~ 9400 4850
Wire Wire Line
	9400 4850 9400 4800
Text Label 6100 4500 0    50   ~ 0
DIN-TOP
Text Label 7625 4500 2    50   ~ 0
DIN-TOP
$Comp
L power:GND #PWR?
U 1 1 5C971076
P 7700 1700
AR Path="/5C971076" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C971076" Ref="#PWR024"  Part="1" 
F 0 "#PWR024" H 7700 1450 50  0001 C CNN
F 1 "GND" H 7705 1527 50  0000 C CNN
F 2 "" H 7700 1700 50  0001 C CNN
F 3 "" H 7700 1700 50  0001 C CNN
	1    7700 1700
	1    0    0    -1  
$EndComp
$Comp
L power:+3V3 #PWR?
U 1 1 5C97107C
P 7700 1500
AR Path="/5C97107C" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C97107C" Ref="#PWR023"  Part="1" 
F 0 "#PWR023" H 7700 1350 50  0001 C CNN
F 1 "+3V3" H 7715 1673 50  0000 C CNN
F 2 "" H 7700 1500 50  0001 C CNN
F 3 "" H 7700 1500 50  0001 C CNN
	1    7700 1500
	1    0    0    -1  
$EndComp
$Comp
L Device:C_Small C?
U 1 1 5C971082
P 7700 1600
AR Path="/5C971082" Ref="C?"  Part="1" 
AR Path="/5C920754/5C971082" Ref="C8"  Part="1" 
F 0 "C8" H 7792 1646 50  0000 L CNN
F 1 "0.1u" H 7792 1555 50  0000 L CNN
F 2 "Capacitor_SMD:C_0402_1005Metric" H 7700 1600 50  0001 C CNN
F 3 "~" H 7700 1600 50  0001 C CNN
F 4 "VJ0402G104KXQCW1BC" H 400 -1450 50  0001 C CNN "MPN"
F 5 "VJ0402G104KXQCW1BC" H 400 -1450 50  0001 C CNN "SKU"
F 6 "Shenzhen" H 400 -1450 50  0001 C CNN "OPL"
F 7 "50" H 400 -1450 50  0001 C CNN "Min Quantity"
	1    7700 1600
	1    0    0    -1  
$EndComp
$Comp
L power:+3V3 #PWR?
U 1 1 5C97108B
P 8050 1300
AR Path="/5C97108B" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C97108B" Ref="#PWR025"  Part="1" 
F 0 "#PWR025" H 8050 1150 50  0001 C CNN
F 1 "+3V3" H 8065 1473 50  0000 C CNN
F 2 "" H 8050 1300 50  0001 C CNN
F 3 "" H 8050 1300 50  0001 C CNN
	1    8050 1300
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C971097
P 8050 2000
AR Path="/5C971097" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C971097" Ref="#PWR026"  Part="1" 
F 0 "#PWR026" H 8050 1750 50  0001 C CNN
F 1 "GND" H 8055 1827 50  0000 C CNN
F 2 "" H 8050 2000 50  0001 C CNN
F 3 "" H 8050 2000 50  0001 C CNN
	1    8050 2000
	1    0    0    -1  
$EndComp
Connection ~ 9350 1600
Wire Wire Line
	9500 1600 9350 1600
$Comp
L power:GND #PWR?
U 1 1 5C9710A0
P 9350 1900
AR Path="/5C9710A0" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9710A0" Ref="#PWR031"  Part="1" 
F 0 "#PWR031" H 9350 1650 50  0001 C CNN
F 1 "GND" H 9355 1727 50  0000 C CNN
F 2 "" H 9350 1900 50  0001 C CNN
F 3 "" H 9350 1900 50  0001 C CNN
	1    9350 1900
	1    0    0    -1  
$EndComp
Wire Wire Line
	9350 1600 9350 1700
Wire Wire Line
	9050 1600 9350 1600
$Comp
L Device:C_Small C?
U 1 1 5C9710A8
P 9350 1800
AR Path="/5C9710A8" Ref="C?"  Part="1" 
AR Path="/5C920754/5C9710A8" Ref="C10"  Part="1" 
F 0 "C10" H 9442 1846 50  0000 L CNN
F 1 "0.1u" H 9442 1755 50  0000 L CNN
F 2 "Capacitor_SMD:C_0402_1005Metric" H 9350 1800 50  0001 C CNN
F 3 "~" H 9350 1800 50  0001 C CNN
F 4 "VJ0402G104KXQCW1BC" H 400 -1450 50  0001 C CNN "MPN"
F 5 "VJ0402G104KXQCW1BC" H 400 -1450 50  0001 C CNN "SKU"
F 6 "Shenzhen" H 400 -1450 50  0001 C CNN "OPL"
F 7 "50" H 400 -1450 50  0001 C CNN "Min Quantity"
	1    9350 1800
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5C9734D3
P 2126 6436
AR Path="/5C9734D3" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9734D3" Ref="#PWR04"  Part="1" 
F 0 "#PWR04" H 2126 6186 50  0001 C CNN
F 1 "GND" H 2131 6263 50  0000 C CNN
F 2 "" H 2126 6436 50  0001 C CNN
F 3 "" H 2126 6436 50  0001 C CNN
	1    2126 6436
	1    0    0    -1  
$EndComp
$Comp
L Connector_Generic:Conn_01x06 J?
U 1 1 5C9734D9
P 2826 6636
AR Path="/5C9734D9" Ref="J?"  Part="1" 
AR Path="/5C920754/5C9734D9" Ref="J2"  Part="1" 
F 0 "J2" H 2906 6628 50  0000 L CNN
F 1 "TC2030_NL" H 2906 6537 50  0000 L CNN
F 2 "Connector:Tag-Connect_TC2030-IDC-NL_2x03_P1.27mm_Vertical" H 2826 6636 50  0001 C CNN
F 3 "http://www.tag-connect.com/TC2030-MCP-NL" H 2826 6636 50  0001 C CNN
	1    2826 6636
	1    0    0    -1  
$EndComp
Text HLabel 4000 6550 0    50   UnSpc ~ 0
BATT-BOT
Text Label 3600 1150 0    50   ~ 0
VIN
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
F 2 "Connector_Molex:Molex_PicoBlade_53047-0210_1x02_P1.25mm_Vertical" H 5000 1250 50  0001 C CNN
F 3 "~" H 5000 1250 50  0001 C CNN
F 4 "0530470210" H 5000 1250 50  0001 C CNN "MPN"
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
F 2 "Connector_Molex:Molex_PicoBlade_53047-0210_1x02_P1.25mm_Vertical" H 5000 800 50  0001 C CNN
F 3 "~" H 5000 800 50  0001 C CNN
F 4 "0530470210" H 5000 800 50  0001 C CNN "MPN"
	1    5000 800 
	1    0    0    -1  
$EndComp
Text Label 3075 775  2    50   ~ 0
BATT
Text Label 4500 800  0    50   ~ 0
BNC-1
Text Label 4500 1250 0    50   ~ 0
BNC-2
Wire Wire Line
	4500 800  4800 800 
Wire Wire Line
	4800 1250 4500 1250
Text Label 2626 6836 2    50   ~ 0
MOSI
Text Label 2626 6736 2    50   ~ 0
MISO
Text Label 2626 6636 2    50   ~ 0
SCK
Text Label 2626 6536 2    50   ~ 0
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
Text Label 1298 6778 0    50   ~ 0
DTR
Text Label 1298 6678 0    50   ~ 0
RXI
Text Label 1298 6878 0    50   ~ 0
TXO
$Comp
L power:GND #PWR?
U 1 1 5C9D7E71
P 998 7078
AR Path="/5C9D7E71" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9D7E71" Ref="#PWR03"  Part="1" 
F 0 "#PWR03" H 998 6828 50  0001 C CNN
F 1 "GND" H 1003 6905 50  0000 C CNN
F 2 "" H 998 7078 50  0001 C CNN
F 3 "" H 998 7078 50  0001 C CNN
	1    998  7078
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
Text Label 1298 6478 0    50   ~ 0
+5V_EXT
Text Label 2626 6936 2    50   ~ 0
+5V_EXT
Text HLabel 4000 6650 0    50   Input ~ 0
BNC-3
Text HLabel 4000 6750 0    50   Input ~ 0
BNC-4
$Comp
L Device:Battery_Cell BT?
U 1 1 5CA04C70
P 1450 1100
AR Path="/5CA04C70" Ref="BT?"  Part="1" 
AR Path="/5C920CA4/5CA04C70" Ref="BT?"  Part="1" 
AR Path="/5C920754/5CA04C70" Ref="BT1"  Part="1" 
F 0 "BT1" H 1568 1196 50  0000 L CNN
F 1 "CR2032" H 1568 1105 50  0000 L CNN
F 2 "gsg-modules:BK-912" V 1450 1160 50  0001 C CNN
F 3 "http://www.memoryprotectiondevices.com/datasheets/BK-912-datasheet.pdf" V 1450 1160 50  0001 C CNN
F 4 "1" H 450 -200 50  0001 C CNN "Min Quantity"
	1    1450 1100
	1    0    0    -1  
$EndComp
Text Label 950  900  0    50   ~ 0
BATT
Text Label 950  1200 0    50   ~ 0
BATT-BOT
Text Label 4100 6550 0    50   ~ 0
BATT-BOT
Text Label 4100 6750 0    50   ~ 0
BNC-4
Text Label 4100 6650 0    50   ~ 0
BNC-3
Text Label 9500 1600 0    50   ~ 0
Z-ACCEL
Text Label 10275 4500 0    50   ~ 0
DOUT
Text Label 4100 6850 0    50   ~ 0
DOUT-BOT
Text HLabel 4000 6850 0    50   Output ~ 0
DOUT
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
+5V
Wire Wire Line
	4000 6450 4550 6450
Connection ~ 4550 6450
$Comp
L Connector:USB_B_Mini J1
U 1 1 5CA5B90D
P 998 6678
F 0 "J1" H 1055 7145 50  0000 C CNN
F 1 "USB_B_Mini" H 1055 7054 50  0000 C CNN
F 2 "node:USB_Mini-B" H 1148 6628 50  0001 C CNN
F 3 "http://www.hqchip.com/uploads/goods/201712/1513300237267023233.pdf" H 1148 6628 50  0001 C CNN
F 4 "U-M-M5SS-W-2	" H -852 1728 50  0001 C CNN "MPN"
F 5 "U-M-M5SS-W-2	" H -852 1728 50  0001 C CNN "SKU"
F 6 "Shenzhen" H -852 1728 50  0001 C CNN "OPL"
	1    998  6678
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
	2126 6436 2626 6436
Wire Wire Line
	898  7078 998  7078
Connection ~ 998  7078
NoConn ~ 9050 1400
NoConn ~ 9050 1500
Text Notes 7795 2413 0    50   ~ 0
See EVAL-ADXL337Z eval board / UG-242
Wire Notes Line
	9500 2300 9500 2450
Wire Notes Line
	9500 2450 7750 2450
Wire Notes Line
	7750 2450 7750 2300
$Comp
L power:GND #PWR?
U 1 1 5C9EBDEA
P 9050 1900
AR Path="/5C9EBDEA" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9EBDEA" Ref="#PWR0106"  Part="1" 
F 0 "#PWR0106" H 9050 1650 50  0001 C CNN
F 1 "GND" H 9055 1727 50  0000 C CNN
F 2 "" H 9050 1900 50  0001 C CNN
F 3 "" H 9050 1900 50  0001 C CNN
	1    9050 1900
	1    0    0    -1  
$EndComp
Wire Wire Line
	9050 1900 9050 1800
Wire Notes Line
	7750 2300 9500 2300
$Comp
L Device:C_Small C?
U 1 1 5C9FFE1D
P 2850 2600
AR Path="/5C9FFE1D" Ref="C?"  Part="1" 
AR Path="/5C920754/5C9FFE1D" Ref="C14"  Part="1" 
F 0 "C14" H 2941 2517 50  0000 L CNN
F 1 "1u" H 2942 2600 50  0000 L CNN
F 2 "Capacitor_SMD:C_0603_1608Metric" H 2850 2600 50  0001 C CNN
F 3 "~" H 2850 2600 50  0001 C CNN
F 4 "10V" H 2936 2691 50  0000 L CNN "Vrating"
F 5 "CC0402KRX5R6BB105        " H -100 1400 50  0001 C CNN "MPN"
F 6 "CC0402KRX5R6BB105        " H -100 1400 50  0001 C CNN "SKU"
F 7 "Shenzhen" H -100 1400 50  0001 C CNN "OPL"
F 8 "50" H -100 1400 50  0001 C CNN "Min Quantity"
	1    2850 2600
	1    0    0    -1  
$EndComp
$Comp
L power:GND #PWR?
U 1 1 5CA00277
P 2850 2800
AR Path="/5CA00277" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5CA00277" Ref="#PWR032"  Part="1" 
F 0 "#PWR032" H 2850 2550 50  0001 C CNN
F 1 "GND" H 2855 2627 50  0000 C CNN
F 2 "" H 2850 2800 50  0001 C CNN
F 3 "" H 2850 2800 50  0001 C CNN
	1    2850 2800
	1    0    0    -1  
$EndComp
Wire Wire Line
	2500 2400 2850 2400
Wire Wire Line
	2850 2400 2850 2500
Text Notes 1375 3375 0    50   ~ 0
See LP2985-N datasheet ([0.01uF \ncapacitor on BP]  may be omitted\nif application is not noise critical)
Connection ~ 2850 2400
Text Notes 1250 5300 0    50   ~ 0
See XC6204/XC6205 datasheet\n("Please wire the input capacitor (CIN)\nand the output capacitor (CL) as close\nto the IC as possible.")
Wire Notes Line
	1200 4950 2800 4950
Wire Notes Line
	2800 4950 2800 5350
Wire Notes Line
	2800 5350 1200 5350
Wire Notes Line
	1200 5350 1200 4950
$Comp
L Device:C_Small C?
U 1 1 5C956699
P 1250 4375
AR Path="/5C956699" Ref="C?"  Part="1" 
AR Path="/5C920754/5C956699" Ref="C1"  Part="1" 
F 0 "C1" H 1073 4476 50  0000 L CNN
F 1 "1u" H 1073 4376 50  0000 L CNN
F 2 "Capacitor_SMD:C_0603_1608Metric" H 1250 4375 50  0001 C CNN
F 3 "~" H 1250 4375 50  0001 C CNN
F 4 "10V" H 1023 4301 50  0000 L CNN "Vrating"
F 5 "CC0402KRX5R6BB105        " H -300 2125 50  0001 C CNN "MPN"
F 6 "CC0402KRX5R6BB105        " H -300 2125 50  0001 C CNN "SKU"
F 7 "Shenzhen" H -300 2125 50  0001 C CNN "OPL"
F 8 "50" H -300 2125 50  0001 C CNN "Min Quantity"
	1    1250 4375
	1    0    0    -1  
$EndComp
$Comp
L power:+3V3 #PWR?
U 1 1 5C9566B7
P 2725 4100
AR Path="/5C9566B7" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9566B7" Ref="#PWR09"  Part="1" 
F 0 "#PWR09" H 2725 3950 50  0001 C CNN
F 1 "+3V3" H 2740 4273 50  0000 C CNN
F 2 "" H 2725 4100 50  0001 C CNN
F 3 "" H 2725 4100 50  0001 C CNN
	1    2725 4100
	1    0    0    -1  
$EndComp
Wire Wire Line
	2850 2800 2850 2700
$Comp
L power:GND #PWR?
U 1 1 5C9566AB
P 2725 4650
AR Path="/5C9566AB" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9566AB" Ref="#PWR010"  Part="1" 
F 0 "#PWR010" H 2725 4400 50  0001 C CNN
F 1 "GND" H 2730 4477 50  0000 C CNN
F 2 "" H 2725 4650 50  0001 C CNN
F 3 "" H 2725 4650 50  0001 C CNN
	1    2725 4650
	1    0    0    -1  
$EndComp
Wire Wire Line
	2725 4650 2725 4475
Wire Wire Line
	2725 4100 2725 4125
Wire Wire Line
	2350 4125 2725 4125
Connection ~ 2725 4125
Wire Wire Line
	2725 4125 2725 4275
NoConn ~ 2350 4325
Wire Wire Line
	1550 4125 1475 4125
Wire Wire Line
	1250 4125 1250 4275
Wire Wire Line
	1550 4325 1475 4325
Wire Wire Line
	1475 4325 1475 4125
Connection ~ 1475 4125
Wire Wire Line
	1475 4125 1250 4125
Wire Wire Line
	1250 4475 1250 4650
Text Label 1250 4125 0    50   ~ 0
VIN
NoConn ~ 2300 2500
Wire Notes Line
	1350 3100 2750 3100
Wire Notes Line
	2750 3100 2750 3425
Wire Notes Line
	2750 3425 1350 3425
Wire Notes Line
	1350 3425 1350 3100
$Comp
L node:WS2812D-F5 D2
U 1 1 5C98F418
P 8025 4500
F 0 "D2" H 7825 4750 50  0000 L CNN
F 1 "WS2812D-F5" H 8050 4250 50  0000 L CNN
F 2 "node:WS2812D-F5" H 8075 4200 50  0001 L TNN
F 3 "http://www.world-semi.com/DownLoadFile/135" H 8125 4125 50  0001 L TNN
	1    8025 4500
	1    0    0    -1  
$EndComp
$Comp
L node:WS2812D-F5 D3
U 1 1 5C993699
P 9400 4500
F 0 "D3" H 9200 4750 50  0000 L CNN
F 1 "WS2812D-F5" H 9450 4250 50  0000 L CNN
F 2 "node:WS2812D-F5" H 9450 4200 50  0001 L TNN
F 3 "http://www.world-semi.com/DownLoadFile/135" H 9500 4125 50  0001 L TNN
	1    9400 4500
	1    0    0    -1  
$EndComp
Wire Wire Line
	9700 4500 10275 4500
$Comp
L power:GND #PWR?
U 1 1 5C9566C3
P 1950 4650
AR Path="/5C9566C3" Ref="#PWR?"  Part="1" 
AR Path="/5C920754/5C9566C3" Ref="#PWR05"  Part="1" 
F 0 "#PWR05" H 1950 4400 50  0001 C CNN
F 1 "GND" H 1955 4477 50  0000 C CNN
F 2 "" H 1950 4650 50  0001 C CNN
F 3 "" H 1950 4650 50  0001 C CNN
	1    1950 4650
	1    0    0    -1  
$EndComp
Wire Wire Line
	1950 4650 1950 4575
Wire Wire Line
	8050 1800 8050 2000
Wire Wire Line
	8050 1700 8050 1800
Connection ~ 8050 1800
Wire Wire Line
	8050 1500 8050 1400
Wire Wire Line
	8050 1300 8050 1400
Connection ~ 8050 1400
NoConn ~ 5200 2600
NoConn ~ 5200 3400
NoConn ~ 5200 3500
NoConn ~ 5200 3600
NoConn ~ 5200 3700
NoConn ~ 5200 3800
NoConn ~ 5200 4600
NoConn ~ 5200 4700
NoConn ~ 5200 4800
NoConn ~ 4000 2600
NoConn ~ 4000 2700
Text HLabel 4000 6950 0    50   UnSpc ~ 0
GND
$Comp
L power:PWR_FLAG #FLG0103
U 1 1 5CA115EA
P 3425 1125
F 0 "#FLG0103" H 3425 1200 50  0001 C CNN
F 1 "PWR_FLAG" H 3425 1298 50  0000 C CNN
F 2 "" H 3425 1125 50  0001 C CNN
F 3 "~" H 3425 1125 50  0001 C CNN
	1    3425 1125
	1    0    0    -1  
$EndComp
Text Label 2925 1450 2    50   ~ 0
+5V_EXT
Wire Wire Line
	3075 1450 2925 1450
Wire Wire Line
	3275 1150 3425 1150
Wire Wire Line
	3425 1125 3425 1150
Connection ~ 3425 1150
Wire Wire Line
	3425 1150 3600 1150
$Comp
L Diode:BAT54CW D?
U 1 1 5C995166
P 3075 1150
AR Path="/5C995166" Ref="D?"  Part="1" 
AR Path="/5C920754/5C995166" Ref="D1"  Part="1" 
F 0 "D1" V 3121 1237 50  0000 L CNN
F 1 "BAT54CW" V 3030 1237 50  0000 L CNN
F 2 "Package_TO_SOT_SMD:SOT-323_SC-70" H 3150 1275 50  0001 L CNN
F 3 "https://assets.nexperia.com/documents/data-sheet/BAT54W_SER.pdf" H 2995 1150 50  0001 C CNN
F 4 "BAT54C-7-F" H 2025 -1100 50  0001 C CNN "MPN"
F 5 "BAT54C-7-F" H 2025 -1100 50  0001 C CNN "SKU"
F 6 "Shenzhen" H 2025 -1100 50  0001 C CNN "OPL"
F 7 "20" H 2025 -1100 50  0001 C CNN "Min Quantity"
	1    3075 1150
	0    -1   -1   0   
$EndComp
Wire Wire Line
	3075 850  3075 775 
Wire Wire Line
	950  900  1450 900 
Wire Wire Line
	1450 1200 950  1200
$Comp
L node:ADXL337 U4
U 1 1 5CA5DC36
P 8550 1600
F 0 "U4" H 8550 2054 45  0000 C CNN
F 1 "ADXL337" H 8550 1970 45  0000 C CNN
F 2 "Package_CSP:LFCSP-16-1EP_3x3mm_P0.5mm_EP1.6x1.6mm" H 8550 2000 20  0001 C CNN
F 3 "" H 8550 1600 60  0001 C CNN
	1    8550 1600
	1    0    0    -1  
$EndComp
$Comp
L node:PMIC-LDO-XC6204B332MR_SOT23-5 U1
U 1 1 5CA60CA4
P 1950 4225
F 0 "U1" H 1950 4579 45  0000 C CNN
F 1 "PMIC-LDO-XC6204B332MR_SOT23-5" H 1950 4495 45  0000 C CNN
F 2 "Package_TO_SOT_SMD:SOT-23-5" H 2000 4625 50  0001 C CNN
F 3 "" H 1950 4225 50  0001 C CNN
F 4 "XC6204B332MR" H 1980 4375 20  0001 C CNN "MPN"
F 5 "310030046" H 1980 4375 20  0001 C CNN "SKU"
	1    1950 4225
	1    0    0    -1  
$EndComp
$EndSCHEMATC
