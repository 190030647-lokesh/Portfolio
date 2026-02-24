package com.portfolio.controller;

import com.portfolio.model.ContactMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.notify.to}")
    private String notifyTo;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends you a notification email when someone submits the contact form.
     */
    public void sendContactNotification(ContactMessage msg) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(notifyTo);
        mail.setSubject("📬 New Portfolio Message from " + msg.getName());
        mail.setText(
            "You received a new message from your portfolio:\n\n" +
            "Name    : " + msg.getName()    + "\n" +
            "Email   : " + msg.getEmail()   + "\n" +
            "Message :\n" + msg.getMessage() + "\n\n" +
            "Sent at : " + msg.getSentAt()
        );
        mailSender.send(mail);
    }
}
