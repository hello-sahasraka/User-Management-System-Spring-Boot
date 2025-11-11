package com.user.management.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendSimpleMail(String to, String password) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("sahasra1234pp@gmail.com");
            message.setTo(to);
            message.setSubject("ACCENTRA Account Password");
            message.setText("Your account has been created successfully.\nYour account password: " + password);
            mailSender.send(message);
            System.out.println("Mail sent to " + to);
        } catch (Exception e) {
            System.err.println("Mail failed: " + e.getMessage());
            e.printStackTrace();
        }
    }


}
