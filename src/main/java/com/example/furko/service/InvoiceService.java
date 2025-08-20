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

    // Alle Rechnungen anzeigen
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    // Rechnung anlegen
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

    // Rechnung aufrufen
    public Invoice getInvoice(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice mit ID " + id + " nicht gefunden!"));
    }

    // Rechnung bezahlen
    public Invoice payInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rechnung nicht gefunden!"));
        invoice.setStatus("PAID");
        return invoiceRepository.save(invoice);
    }

    // Rechnung löschen
    public void deleteInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice mit ID " + id + " nicht gefunden!"));
/*        if(!invoiceRepository.existsById(id)) {
            throw new RuntimeException("Invoice mit ID " + id + " nicht gefunden!");
        }
        invoiceRepository.deleteById(id);*/
    }
}