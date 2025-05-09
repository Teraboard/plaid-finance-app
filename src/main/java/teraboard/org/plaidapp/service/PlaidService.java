package teraboard.org.plaidapp.service;

import com.plaid.client.model.CountryCode;
import com.plaid.client.model.Products;
import com.plaid.client.model.LinkTokenCreateRequest;
import com.plaid.client.model.LinkTokenCreateResponse;
import com.plaid.client.model.ItemPublicTokenExchangeRequest;
import com.plaid.client.model.ItemPublicTokenExchangeResponse;
import com.plaid.client.model.TransactionsGetRequest;
import com.plaid.client.model.TransactionsGetRequestOptions;
import com.plaid.client.model.TransactionsGetResponse;
import com.plaid.client.request.PlaidApi;

import retrofit2.Response;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import teraboard.org.plaidapp.model.PlaidItem;
import teraboard.org.plaidapp.model.Transaction;
import teraboard.org.plaidapp.model.TransactionCategory;
import teraboard.org.plaidapp.repository.PlaidItemRepository;
import teraboard.org.plaidapp.repository.TransactionRepository;

@Service
public class PlaidService {
    private static final Logger logger = LoggerFactory.getLogger(PlaidService.class);
    
    @Autowired
    private PlaidApi plaidClient;
    
    @Autowired
    private PlaidItemRepository plaidItemRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private Environment env;
    
    // Comment out the redirect URI value annotation
    // @Value("${plaid.redirect-uri:http://localhost:3000/oauth-redirect}")
    // private String redirectUri;
    
    /**
     * Get client ID from environment variables with fallback to properties file
     */
    private String getClientId() {
        String envClientId = env.getProperty("PLAID_CLIENT_ID");
        return envClientId != null ? envClientId : env.getProperty("plaid.client-id");
    }
    
    /**
     * Get secret from environment variables with fallback to properties file
     */
    private String getSecret() {
        String envSecret = env.getProperty("PLAID_SECRET");
        return envSecret != null ? envSecret : env.getProperty("plaid.secret");
    }
    
    /**
     * Create a link token for initializing Plaid Link
     */
    public String createLinkToken(String userId) {
        try {
            // Create the Link token request with required parameters
            com.plaid.client.model.LinkTokenCreateRequestUser user = new com.plaid.client.model.LinkTokenCreateRequestUser()
                    .clientUserId(userId);
            
            // Set the products to share and country codes
            List<Products> products = Arrays.asList(Products.TRANSACTIONS);
            List<CountryCode> countryCodes = Arrays.asList(CountryCode.US);
            
            // Build the request
            LinkTokenCreateRequest request = new LinkTokenCreateRequest()
                    .user(user)
                    .clientName("Plaid Finance App")
                    .products(products)
                    .language("en")
                    .countryCodes(countryCodes);
            
            // Execute the request synchronously
            Response<LinkTokenCreateResponse> response = plaidClient
                    .linkTokenCreate(request)
                    .execute();
                    
            if (response.isSuccessful() && response.body() != null) {
                return response.body().getLinkToken();
            } else {
                logger.error("Error creating link token: {}", 
                    response.errorBody() != null ? response.errorBody().string() : "Unknown error");
                throw new RuntimeException("Failed to create link token");
            }
        } catch (IOException e) {
            logger.error("IO Exception creating link token", e);
            throw new RuntimeException("Failed to create link token", e);
        } catch (RuntimeException e) {
            logger.error("Runtime Exception creating link token", e);
            throw new RuntimeException("Failed to create link token", e);
        }
    }
    
    /**
     * Exchange a public token for an access token and item ID
     */
    public teraboard.org.plaidapp.model.PlaidItem exchangePublicToken(String publicToken, String userId, String institutionId, String institutionName) {
        try {
            // Create the exchange request
            ItemPublicTokenExchangeRequest request = new ItemPublicTokenExchangeRequest()
                    .publicToken(publicToken);
                    
            // Execute the request synchronously
            Response<ItemPublicTokenExchangeResponse> response = plaidClient
                    .itemPublicTokenExchange(request)
                    .execute();
                    
            if (response.isSuccessful() && response.body() != null) {
                String accessToken = response.body().getAccessToken();
                String itemId = response.body().getItemId();
                
                logger.info("Successfully exchanged public token for item ID: {} and access token (redacted)", itemId);
                
                teraboard.org.plaidapp.model.PlaidItem plaidItem = new teraboard.org.plaidapp.model.PlaidItem(itemId, accessToken, institutionId, institutionName, userId);
                return plaidItemRepository.save(plaidItem);
            } else {
                logger.error("Error exchanging public token: {}", 
                    response.errorBody() != null ? response.errorBody().string() : "Unknown error");
                throw new RuntimeException("Failed to exchange public token");
            }
        } catch (IOException e) {
            logger.error("IO Exception exchanging public token", e);
            throw new RuntimeException("Failed to exchange public token", e);
        } catch (RuntimeException e) {
            logger.error("Runtime Exception exchanging public token", e);
            throw new RuntimeException("Failed to exchange public token", e);
        }
    }
    
    /**
     * Fetch transactions for a specific item
     */
    public List<Transaction> fetchTransactions(String itemId) {
        try {
            logger.info("Fetching transactions for item ID: {}", itemId);
            
            Optional<teraboard.org.plaidapp.model.PlaidItem> plaidItemOpt = plaidItemRepository.findByPlaidItemId(itemId);
            if (plaidItemOpt.isEmpty()) {
                logger.error("Plaid item not found: {}", itemId);
                throw new RuntimeException("Plaid item not found: " + itemId);
            }
            
            teraboard.org.plaidapp.model.PlaidItem plaidItem = plaidItemOpt.get();
            String accessToken = plaidItem.getAccessToken();
            
            logger.debug("Using access token (redacted) for item ID: {}", itemId);
            
            // Define date range - last 30 days
            LocalDate endDate = LocalDate.now();
            LocalDate startDate = endDate.minusDays(30);
            
            logger.debug("Fetching transactions from {} to {}", startDate, endDate);
            
            // Create options
            TransactionsGetRequestOptions options = new TransactionsGetRequestOptions();
            
            // Create the transaction request
            TransactionsGetRequest request = new TransactionsGetRequest()
                .accessToken(accessToken)
                .startDate(startDate)
                .endDate(endDate)
                .options(options);
                    
            // Execute the request synchronously
            Response<TransactionsGetResponse> response = plaidClient
                .transactionsGet(request)
                .execute();
                    
            if (response.isSuccessful() && response.body() != null) {
                List<Transaction> transactions = new ArrayList<>();
                List<com.plaid.client.model.Transaction> plaidTransactions = 
                    new ArrayList<>(response.body().getTransactions());
                
                logger.info("Initially fetched {} transactions of {} total", 
                    plaidTransactions.size(), response.body().getTotalTransactions());
                
                // Paginate through transactions if there are more
                int totalTransactions = response.body().getTotalTransactions();
                while (plaidTransactions.size() < totalTransactions) {
                    logger.debug("Fetching additional transactions, offset: {}", plaidTransactions.size());
                    
                    // Update options with new offset
                    options = new TransactionsGetRequestOptions()
                        .offset(plaidTransactions.size());
                    request = new TransactionsGetRequest()
                        .accessToken(accessToken)
                        .startDate(startDate)
                        .endDate(endDate)
                        .options(options);
                    
                    response = plaidClient.transactionsGet(request).execute();
                    
                    if (response.isSuccessful() && response.body() != null) {
                        plaidTransactions.addAll(response.body().getTransactions());
                        logger.debug("Fetched additional {} transactions, total now: {}", 
                            response.body().getTransactions().size(), plaidTransactions.size());
                    } else {
                        logger.error("Failed to fetch additional transactions: {}", 
                            response.errorBody() != null ? response.errorBody().string() : "Unknown error");
                        break;
                    }
                }
                
                // Log information about fetched transactions
                logger.info("Successfully fetched {} transactions for processing", plaidTransactions.size());
                
                // Convert Plaid transactions to our model
                for (com.plaid.client.model.Transaction plaidTransaction : plaidTransactions) {
                    try {
                        Transaction transaction = convertPlaidTransaction(plaidTransaction, plaidItem);
                        transactions.add(transaction);
                    } catch (Exception e) {
                        logger.error("Error converting transaction: {}", plaidTransaction.getTransactionId(), e);
                        // Continue with next transaction even if one fails
                    }
                }
                
                logger.info("Successfully converted {} transactions", transactions.size());
                
                if (transactions.isEmpty()) {
                    logger.warn("No transactions were converted from Plaid data");
                    return Collections.emptyList();
                }
                
                // Save all transactions to the database
                try {
                    List<Transaction> savedTransactions = transactionRepository.saveAll(transactions);
                    logger.info("Successfully saved {} transactions to database", savedTransactions.size());
                    return savedTransactions;
                } catch (Exception e) {
                    logger.error("Error saving transactions to database", e);
                    throw new RuntimeException("Failed to save transactions to database", e);
                }
            } else {
                logger.error("Error fetching transactions: {}", 
                    response.errorBody() != null ? response.errorBody().string() : "Unknown error");
                throw new RuntimeException("Failed to fetch transactions");
            }
        } catch (IOException e) {
            logger.error("IO Exception fetching transactions", e);
            throw new RuntimeException("Failed to fetch transactions", e);
        } catch (RuntimeException e) {
            logger.error("Runtime Exception fetching transactions", e);
            throw new RuntimeException("Failed to fetch transactions", e);
        }
    }
    
    /**
     * Convert a Plaid transaction to our application's Transaction model
     */
    private Transaction convertPlaidTransaction(com.plaid.client.model.Transaction plaidTransaction, teraboard.org.plaidapp.model.PlaidItem plaidItem) {
        Transaction transaction = new Transaction();
        
        // Set transaction ID from Plaid if available
        transaction.setTransactionId(plaidTransaction.getTransactionId());
        
        // Set reference to the plaid item
        transaction.setPlaidItemId(plaidItem.getPlaidItemId());
        
        transaction.setName(plaidTransaction.getName());
        
        // Handle merchant name if available
        if (plaidTransaction.getMerchantName() != null && !plaidTransaction.getMerchantName().isEmpty()) {
            transaction.setMerchantName(plaidTransaction.getMerchantName());
        }
        
        // Convert amount (Plaid amounts are positive for debits, negative for credits)
        Double amount = plaidTransaction.getAmount();
        if (amount != null) {
            // Reverse the sign to match our convention (positive for income)
            transaction.setAmount(-amount);
        }
        
        // Convert date
        transaction.setDate(plaidTransaction.getDate() != null ? plaidTransaction.getDate().toString() : null);
        
        // Set pending status
        transaction.setPending(plaidTransaction.getPending());
        
        // Map Plaid categories to our categories
        List<String> categories = plaidTransaction.getCategory();
        String primaryCategory = getCategory(categories);
        transaction.setCategory(TransactionCategory.fromString(primaryCategory));
        
        // Store original Plaid categories for reference
        if (categories != null && !categories.isEmpty()) {
            transaction.setOriginalCategories(String.join(",", categories));
        }
        
        // Log the conversion details
        logger.debug("Converted Plaid transaction: {} -> App transaction: name={}, amount={}, date={}, category={}", 
            plaidTransaction.getTransactionId(), 
            transaction.getName(), 
            transaction.getAmount(), 
            transaction.getDate(), 
            transaction.getCategory());
        
        return transaction;
    }
    
    /**
     * Map Plaid categories to our application's categories
     */
    private String getCategory(List<String> plaidCategories) {
        if (plaidCategories == null || plaidCategories.isEmpty()) {
            return "UNCATEGORIZED";
        }
        
        // Get the primary category (first in the list)
        String primary = plaidCategories.get(0).toUpperCase();
        
        // Map Plaid categories to our categories
        Map<String, String> categoryMap = new HashMap<>();
        categoryMap.put("FOOD_AND_DRINK", "DINING");
        categoryMap.put("RESTAURANTS", "DINING");
        categoryMap.put("GROCERY", "GROCERIES");
        categoryMap.put("GENERAL_MERCHANDISE", "SHOPPING");
        categoryMap.put("SHOPS", "SHOPPING");
        categoryMap.put("HOME_IMPROVEMENT", "HOUSING");
        categoryMap.put("RENT", "HOUSING");
        categoryMap.put("MORTGAGE", "HOUSING");
        categoryMap.put("TRANSFER", "OTHER");
        categoryMap.put("PAYMENT", "OTHER");
        categoryMap.put("TRAVEL", "TRANSPORTATION");
        categoryMap.put("GAS", "TRANSPORTATION");
        categoryMap.put("ENTERTAINMENT", "ENTERTAINMENT");
        categoryMap.put("RECREATION", "ENTERTAINMENT");
        categoryMap.put("MEDICAL", "HEALTHCARE");
        categoryMap.put("HEALTHCARE", "HEALTHCARE");
        categoryMap.put("DEPOSIT", "INCOME");
        categoryMap.put("INCOME", "INCOME");
        categoryMap.put("UTILITIES", "UTILITIES");
        
        String mapped = categoryMap.getOrDefault(primary, "OTHER");
        logger.debug("Mapped Plaid category '{}' to application category '{}'", primary, mapped);
        
        return mapped;
    }
}