#include <SPI.h>
#include "spiTransfer.h"

char spiRxBuffer[spiBufferLength];
char spiTxBuffer[spiBufferLength];

void spiTransferSetup() {
  SPI.begin();
  SPI.setDataMode(SPI_MODE1); // mode 1 seems to be more stable than mode 3
}

void clearSpiTxBuffer() {
  memset(spiTxBuffer, '\0', spiBufferLength);
}

void doSpiTransfer() {
  char printTxBuffer[spiBufferLength + 1]; // TODO: remove

  digitalWrite(SS, LOW);
  for (int i = 0; i < spiBufferLength; i++) {
    char txByte = spiTxBuffer[i];
    char rxByte = SPI.transfer(txByte);
    spiRxBuffer[i] = rxByte;
    printTxBuffer[i] = txByte;
  }
  digitalWrite(SS, HIGH);

#if 1 // TODO: remove this block
  printTxBuffer[spiBufferLength] = '\0';
  Serial.print("Transmitted: ");
  Serial.println(printTxBuffer);
#endif
}
