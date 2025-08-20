package com.example.furko.service;

import com.example.furko.entity.Customer;
import com.example.furko.entity.Invoice;
import com.example.furko.repository.CustomerRepository;
import com.example.furko.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;

    public Invoice createInvoice(Long customerID, Double amount) {
        Customer customer = customerRepository.findById(customerID)
                .orElseThrow(() -> new RuntimeException("Kunde nicht gefunden!"));
        Invoice invoice = Invoice.builder()
                .amount(amount)
                .status("OPEN")
                .customer(customer)
                .build();
        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoice(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice mit ID " + id + " nicht gefunden!"));
    }

    public Invoice payInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rechnung nicht gefunden!"));
        invoice.setStatus("PAID");
        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice mit ID " + id + " nicht gefunden!"));
    }
}