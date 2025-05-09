package teraboard.org.plaidapp.config;

import com.plaid.client.ApiClient;
import com.plaid.client.request.PlaidApi;  // Updated import to correct package
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;

@Configuration
public class PlaidConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(PlaidConfig.class);
    
    @Autowired
    private Environment env;

    @Bean
    public PlaidApi plaidClient() {
        // Get values from environment variables with fallback to properties
        String clientId = env.getProperty("PLAID_CLIENT_ID");
        String secret = env.getProperty("PLAID_SECRET");
        String environment = env.getProperty("PLAID_ENVIRONMENT", "sandbox");
        String securityUsername = env.getProperty("SPRING_SECURITY_USER_NAME");
        String securityPassword = env.getProperty("SPRING_SECURITY_USER_PASSWORD");
        
        // Log the values
        logger.info("PLAID_CLIENT_ID from env: {}", clientId);
        logger.info("PLAID_SECRET from env: {}", secret);
        logger.info("PLAID_ENVIRONMENT from env: {}", environment);
        logger.info("SPRING_SECURITY_USER_NAME from env: {}", securityUsername);
        logger.info("SPRING_SECURITY_USER_PASSWORD from env: {}", securityPassword != null ? "****" : "null");
        
        // Fallback to application.properties if environment variables not set
        if (clientId == null) clientId = env.getProperty("plaid.client-id");
        if (secret == null) secret = env.getProperty("plaid.secret");
        
        // Create HashMap for API keys
        HashMap<String, String> apiKeys = new HashMap<>();
        apiKeys.put("clientId", clientId);
        apiKeys.put("secret", secret);
        
        // Create ApiClient and set environment
        ApiClient apiClient = new ApiClient(apiKeys);
        
        // Set the appropriate Plaid environment
        switch (environment.toLowerCase()) {
            case "sandbox" -> apiClient.setPlaidAdapter(ApiClient.Sandbox);
            case "development" -> apiClient.setPlaidAdapter(ApiClient.Development);
            case "production" -> apiClient.setPlaidAdapter(ApiClient.Production);
            default -> apiClient.setPlaidAdapter(ApiClient.Sandbox); // Default to sandbox
        }
        
        // Create and return the PlaidApi service
        return apiClient.createService(PlaidApi.class);
    }
}