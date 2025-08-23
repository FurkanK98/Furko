package com.example.furko;

import com.example.furko.controller.CustomerController;
import com.example.furko.entity.Customer;
import com.example.furko.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc(addFilters = false) // Erlaubt HTTP-Requests nachzuspielen (REST-Calls sollen nachgestellt werden, ohne Postman/Swagger)
@WebMvcTest(controllers = CustomerController.class)
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc; // Wird von Spring bereitgestellt, um HTTP-Calls zu simulieren

    @MockBean
    private CustomerService customerService;
    private Customer testCustomer;

    @BeforeEach
    void Setup() {
        testCustomer = Customer.builder()
                .id(1L)
                .name("Furkan")
                .email("Furkan@Design.de")
                .phoneNumber("+49 123 456789")
                .address("Furkanstr. 1, 12345 Teststadt")
                .build();
    }

    // GET /api/customers
    @Test
    void testGetAllCustomers() throws Exception {
        Mockito.when(customerService.getAllCustomers()).thenReturn(List.of(testCustomer));

        // Simuliert einen GET-Request auf unseren Customer-Endpoint
        mockMvc.perform(get("/api/customers").contentType(MediaType.APPLICATION_JSON))  // Es soll so tun, als ob HTTP-Client (Browser/Postman) einen Request macht.
                .andExpect(status().isOk()) // Erwartung: HTTP-Status 200 (OK)
                .andExpect(jsonPath("$[0].name").value("Furkan"))
                .andExpect(jsonPath("$[0].email").value("Furkan@Design.de"))
                .andExpect(jsonPath("$[0].phoneNumber").value("+49 123 456789"))
                .andExpect(jsonPath("$[0].address").value("Furkanstr. 1, 12345 Teststadt"));
    }

    // GET /api/customers/{id}
    @Test
    void testGetCustomersByID() throws Exception {
        Mockito.when(customerService.getCustomerById(1L)).thenReturn(Optional.of(testCustomer));

        mockMvc.perform(get("/api/customers/1").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Furkan"))
                .andExpect(jsonPath("$.email").value("Furkan@Design.de"));
    }

    // POST /api/customers
    @Test
    void testCreateCustomer() throws Exception {
        Mockito.when(customerService.saveCustomer(any(Customer.class))).thenReturn(testCustomer);

        String customerJSON = """
                {
                    "name": "Furkan",
                    "email": "furkan@design.de",
                    "phoneNumber": "+49 123 456789",
                    "address": "Furkan@Test.de"
                }
                """;

        mockMvc.perform(post("/api/customers").contentType(MediaType.APPLICATION_JSON).content(customerJSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Furkan"));
    }

    // PUT /api/customers/{id}
     @Test
    void testUpdateCustomer() throws Exception {
        Mockito.when(customerService.updateCustomer(anyLong(), any(Customer.class))).thenReturn(testCustomer);

        String updateJSON = """
                {
                    "name": "Furkan",
                    "email": "Furkan@Design.de",
                    "phoneNumber": "+49 123 456789",
                    "address": "Furkanstr. 1, 12345 Teststadt"
                }
                """;

        mockMvc.perform(put("/api/customers/1").contentType(MediaType.APPLICATION_JSON).content(updateJSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Furkan"));
     }

     // DELETE /api/customers/{id}
    @Test
    void testDeleteCustomer() throws Exception {
        Mockito.doNothing().when(customerService).deleteCustomer(1L);

        mockMvc.perform(delete("/api/customers/1"))
                .andExpect(status().isNoContent());
    }
}