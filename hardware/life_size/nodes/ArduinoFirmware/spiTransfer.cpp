#include <SPI.h>
#include "spiTransfer.h"

char spiRxBuffer[spiBufferLength];
char spiTxBuffer[spiBufferLength];

void spiTransferSetup() {
  SPI.begin();
  SPI.setDataMode(SPI_MODE3);
}


void doSpiTransfer() {
  char printRxBuffer[spiBufferLength + 1];
  char printTxBuffer[spiBufferLength + 1];

  digitalWrite(SS, LOW);
  for (int i = 0; i < spiBufferLength; i++) {
    char txByte = spiTxBuffer[i];
    char rxByte = SPI.transfer(txByte);
    spiRxBuffer[i] = rxByte;
    printTxBuffer[i] = txByte;
    printRxBuffer[i] = rxByte;
  }
  digitalWrite(SS, HIGH);

  printRxBuffer[spiBufferLength] = '\0';
  printTxBuffer[spiBufferLength] = '\0';
  Serial.print("Received: ");
  Serial.println(printRxBuffer);
  Serial.print("Transmitted: ");
  Serial.println(printTxBuffer);
}
