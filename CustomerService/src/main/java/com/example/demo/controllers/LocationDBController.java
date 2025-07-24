package com.example.demo.controllers;

import com.example.demo.entity.Location;
import com.example.demo.services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/location-db")
public class LocationDBController {

    @Autowired
    private LocationService locationService;


    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addLocation(@RequestBody Location location) {
        MyResponse response;
        try {
            Location created = locationService.create(location);
            response = new MyResponse(created, "Location added successfully.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response = new MyResponse(location, e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateLocation(@RequestBody Location updatedLocation) {
        MyResponse response;
        try {
            Location updated = locationService.update(updatedLocation);
            response = new MyResponse(updated, "Location updated successfully.");
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
        } catch (Exception e) {
            response = new MyResponse(updatedLocation, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteLocation(@PathVariable String id) {
        MyResponse response;
        try {
            locationService.delete(id);
            response = new MyResponse(null, "Location deleted successfully.");
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
        } catch (Exception e) {
            response = new MyResponse(null, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getLocation(@PathVariable String id) {
        MyResponse response;
        try {
            Location location = locationService.read(id);
            response = new MyResponse(location, "Location found.");
            return ResponseEntity.status(HttpStatus.FOUND).body(response);
        } catch (Exception e) {
            response = new MyResponse(null, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllLocations() {
        List<Location> list = locationService.readAll();
        return ResponseEntity.ok(list);
    }
}
