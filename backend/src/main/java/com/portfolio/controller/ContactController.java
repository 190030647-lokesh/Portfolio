package com.portfolio.controller;

import com.portfolio.model.ContactMessage;
import com.portfolio.repository.ContactRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    private final ContactRepository contactRepository;
    private final EmailService emailService;

    public ContactController(ContactRepository contactRepository, EmailService emailService) {
        this.contactRepository = contactRepository;
        this.emailService = emailService;
    }

    /**
     * POST /api/contact
     * Saves the message to MySQL and sends you a notification email.
     */
    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> submitContact(
            @Valid @RequestBody ContactMessage message) {

        contactRepository.save(message);

        // Send email notification — log warning if email fails (don't break the API)
        try {
            emailService.sendContactNotification(message);
        } catch (Exception e) {
            log.warn("Email notification failed: {}", e.getMessage());
        }

        return ResponseEntity.ok(Map.of(
            "status",  "success",
            "message", "Thanks " + message.getName() + "! I'll get back to you soon."
        ));
    }
}
