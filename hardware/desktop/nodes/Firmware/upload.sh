#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <device> <node ID>" >&2
    exit 2
fi

echo "#define ID $2" >id.h

cp ../../../../sharedSettings.h .

arduino --board arduino:avr:pro:cpu=16MHzatmega328 \
      --port "$1" --upload ArduinoFirmware.ino
