package com.example.furko.controller;

import com.example.furko.entity.Invoice;
import com.example.furko.service.InvoiceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j // log
@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Tag(name = "Rechnungen", description = "Rechnungen verwalten")
public class InvoiceController {
    private final InvoiceService invoiceService;

    // 1. Alle Rechnungen
    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoice() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    // 2. Einzelne Rechnung abrufen
    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Long id) {
        log.info("Abfrage für Rechnung mit ID: {}", id);
        Invoice invoice = invoiceService.getInvoice(id);
        log.info("Rechnung gefunden: {}", invoice);
        return ResponseEntity.ok(invoice);
    }

    // 3. Neue Rechnung für einen Kunden
    @PostMapping("/{customerID}")
    public ResponseEntity<Invoice> createInvoice(@PathVariable("customerID") Long customerID, @RequestBody Invoice invoiceRequest) {
        return ResponseEntity.ok(invoiceService.createInvoice(customerID, invoiceRequest.getAmount()));
    }

    // 4. Rechnung bezahlen
    @PutMapping("/{id}/pay")
    public ResponseEntity<Invoice> payInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.payInvoice(id));
    }

    // 5. Rechnung löschen
    @DeleteMapping("/{id}")
    public ResponseEntity<Invoice> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}