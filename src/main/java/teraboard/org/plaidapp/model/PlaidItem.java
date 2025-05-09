package teraboard.org.plaidapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "plaid_items")
public class PlaidItem {
    
    @Id
    private String id;
    private String plaidItemId;
    private String accessToken;
    private String institutionId;
    private String institutionName;
    private String userId;
    
    // Default constructor
    public PlaidItem() {
    }
    
    // Constructor with fields
    public PlaidItem(String plaidItemId, String accessToken, String institutionId, String institutionName, String userId) {
        this.plaidItemId = plaidItemId;
        this.accessToken = accessToken;
        this.institutionId = institutionId;
        this.institutionName = institutionName;
        this.userId = userId;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getPlaidItemId() {
        return plaidItemId;
    }
    
    public void setPlaidItemId(String plaidItemId) {
        this.plaidItemId = plaidItemId;
    }
    
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public String getInstitutionId() {
        return institutionId;
    }
    
    public void setInstitutionId(String institutionId) {
        this.institutionId = institutionId;
    }
    
    public String getInstitutionName() {
        return institutionName;
    }
    
    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
}