#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_system.h"
#include "esp_wifi.h"
#include "esp_event_loop.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "sdkconfig.h"

#include "lwip/err.h"
#include "lwip/sys.h"

#define ESP_WIFI_SSID      "OnePlus 6T"
#define ESP_WIFI_PASS      "g1r4ff3nH$US"

static const char *TAG = "wifi";

static const u8_t gw[] = {192, 168, 43, 182};
static const u8_t initialLastOctet = 200;

static void set_ip(const u8_t lastOctet)
{
    tcpip_adapter_ip_info_t ip_info;
    memset(&ip_info, 0, sizeof(ip_info));
    IP4_ADDR(&ip_info.ip, gw[0], gw[1], gw[2], lastOctet);
    IP4_ADDR(&ip_info.gw, gw[0], gw[1], gw[2], gw[3]);
    IP4_ADDR(&ip_info.netmask, 255, 255, 255, 0);
    tcpip_adapter_set_ip_info(TCPIP_ADAPTER_IF_STA, &ip_info);
}

static esp_err_t event_handler(void *ctx, system_event_t *event)
{
    switch(event->event_id) {
    case SYSTEM_EVENT_STA_START:
        esp_wifi_connect();
        break;
    case SYSTEM_EVENT_STA_CONNECTED:
        ESP_LOGI(TAG, "got ip:%s",
                 ip4addr_ntoa(&event->event_info.got_ip.ip_info.ip));
        tcpip_adapter_dhcpc_stop(TCPIP_ADAPTER_IF_STA);
        set_ip(initialLastOctet);
        break;

    case SYSTEM_EVENT_STA_DISCONNECTED:
        {
            esp_wifi_connect();
            ESP_LOGI(TAG,"retry to connect to the AP");
            break;
        }
    default:
        break;
    }
    return ESP_OK;
}

static void init_sta()
{
    wifi_config_t wifi_config;
    memset(&wifi_config, 0, sizeof(wifi_config_t));
    snprintf((char*)wifi_config.sta.ssid, 32, "%s", ESP_WIFI_SSID);
    snprintf((char*)wifi_config.sta.password, 64, "%s", ESP_WIFI_PASS);

    ESP_ERROR_CHECK(esp_wifi_set_config(ESP_IF_WIFI_STA, &wifi_config));

    ESP_LOGI(TAG, "wifi_init_sta finished.");
    ESP_LOGI(TAG, "connect to ap SSID:%s password:%s",
             ESP_WIFI_SSID, ESP_WIFI_PASS);
}

void wifi_set_ip_based_on_id(const char id)
{
    u8_t i = id - 'A';
    set_ip(101 + i);
}

void app_wifi_main()
{
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    wifi_mode_t mode = WIFI_MODE_STA;

    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES ||
        ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
      ESP_ERROR_CHECK(nvs_flash_erase());
      ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    tcpip_adapter_init();
    ESP_ERROR_CHECK(esp_event_loop_init(event_handler, NULL));
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));
    ESP_ERROR_CHECK(esp_wifi_set_mode(mode));

    init_sta();
    ESP_ERROR_CHECK(esp_wifi_start());
}
