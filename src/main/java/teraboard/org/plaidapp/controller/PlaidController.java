package teraboard.org.plaidapp.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import teraboard.org.plaidapp.model.PlaidItem;
import teraboard.org.plaidapp.model.Transaction;
import teraboard.org.plaidapp.service.PlaidService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plaid")
@CrossOrigin(origins = "http://localhost:3000")
public class PlaidController {

    private static final Logger logger = LoggerFactory.getLogger(PlaidController.class);

    @Autowired
    private PlaidService plaidService;

    /**
     * Create a link token for initializing Plaid Link
     */
    @GetMapping("/create-link-token")
    public ResponseEntity<?> createLinkToken() {
        try {
            // Hard-coded user ID for simplicity - in a real app, get this from authenticated user
            String userId = "user-123";
            String linkToken = plaidService.createLinkToken(userId);
            
            Map<String, String> response = new HashMap<>();
            response.put("link_token", linkToken);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error creating link token", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating link token: " + e.getMessage());
        }
    }

    /**
     * Exchange a public token for an access token
     */
    @PostMapping("/set-access-token")
    public ResponseEntity<?> setAccessToken(@RequestBody Map<String, String> request) {
        try {
            String publicToken = request.get("public_token");
            String institutionId = request.get("institution_id");
            String institutionName = request.get("institution_name");
            
            if (publicToken == null || publicToken.isEmpty()) {
                return ResponseEntity.badRequest().body("Public token is required");
            }
            
            // Hard-coded user ID for simplicity - in a real app, get this from authenticated user
            String userId = "user-123";
            
            PlaidItem plaidItem = plaidService.exchangePublicToken(
                publicToken, 
                userId, 
                institutionId != null ? institutionId : "", 
                institutionName != null ? institutionName : ""
            );
            
            return ResponseEntity.ok(plaidItem);
        } catch (Exception e) {
            logger.error("Error setting access token", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error setting access token: " + e.getMessage());
        }
    }

    /**
     * Fetch transactions for a specific item
     */
    @GetMapping("/transactions/{itemId}")
    public ResponseEntity<?> getTransactions(@PathVariable String itemId) {
        try {
            List<Transaction> transactions = plaidService.fetchTransactions(itemId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            logger.error("Error fetching transactions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching transactions: " + e.getMessage());
        }
    }
}