package com.example.furko;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest // Startet die komplette Spring Boot App im Testmodus (inkl. Security, Beans etc.)
@AutoConfigureMockMvc // Erlaubt HTTP-Requests nachzuspielen (REST-Calls sollen nachgestellt werden, ohne Postman/Swagger)
class CustomerControllerTest {
    @Autowired
    private MockMvc mockMvc; // Wird von Spring bereitgestellt, um HTTP-Calls zu simulieren

    @Test
    void ListOfCustomers() throws Exception {
        // Simuliert einen GET-Request auf unseren Customer-Endpoint
        mockMvc.perform(get("/api/customers") // Es soll so tun, als ob HTTP-Client (Browser/Postman) einen Request macht.
                    .contentType(MediaType.APPLICATION_JSON)) // Sagen: Wir erwarten JSON
                .andExpect(status().isOk()) // Erwartung: HTTP-Status 200 (OK)
                .andExpect(jsonPath("$[0].name").exists()) // Erwartung: Erstes Element im JSON hat ein "name"-Feld
                .andExpect(jsonPath("$[0].email").exists()) // Erwartung: Erstes Element im JSON hat ein "email"-Feld
                .andExpect(jsonPath("$[0].address").exists()); // Erwartung: Erstes Element im JSON hat ein "address"-Feld
    }
}