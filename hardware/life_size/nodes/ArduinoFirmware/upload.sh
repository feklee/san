#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <device> <node ID>" >&2
    exit 2
fi

echo "#define ID $2" >id.h

arduino --board arduino:avr:pro:cpu=8MHzatmega328 \
      --port "$1" --upload ArduinoFirmware.ino
