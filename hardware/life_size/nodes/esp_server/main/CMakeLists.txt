set(COMPONENT_SRCS "app_main.c" "app_wifi.c" "app_camera.c" "app_httpd.c" "app_spi.c")
set(COMPONENT_ADD_INCLUDEDIRS "include")

set(COMPONENT_REQUIRES
    esp32-camera
    esp-face
    nvs_flash
    esp_http_server
    fb_gfx
    esp_http_client
    )

register_component()
