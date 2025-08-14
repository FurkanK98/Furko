/* Service-Layer:
- Business-Logik gehört nicht in Controller oder Repository, sondern in Services.
- Dort schreibst du z.B. Regeln, Validierungen, oder komplexere Abläufe.
- Macht deinen Code sauber, testbar und wartbar.
*/

package com.example.furko.service;

import com.example.furko.entity.Customer;
import com.example.furko.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public Customer updateCustomer(Long id, Customer updateCustomer) {
        return customerRepository.findById(id)
                .map(existing -> {
                    existing.setName(updateCustomer.getName());
                    existing.setEmail(updateCustomer.getEmail());
                    existing.setPhoneNumber(updateCustomer.getPhoneNumber());
                    existing.setAddress(updateCustomer.getAddress());
                    return customerRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Kunde wurde nicht gefunden: " + id));
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}