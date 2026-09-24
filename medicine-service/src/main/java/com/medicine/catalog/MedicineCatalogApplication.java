package com.medicine.catalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MedicineCatalogApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedicineCatalogApplication.class, args);
        //this creates application context ,IOC container
    }
}
