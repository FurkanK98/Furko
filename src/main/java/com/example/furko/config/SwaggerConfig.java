// http://localhost:8080/swagger-ui/index.html

package com.example.furko.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Furko - Invoice Management API")
                        .version("1.0")
                        .description("Furko's API für Rechnungen, Zahlungen & Kunden"));
    }
}