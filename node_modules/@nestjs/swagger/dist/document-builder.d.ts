import { OpenAPIObject } from './interfaces';
import { ExternalDocumentationObject, SecurityRequirementObject, SecuritySchemeObject, ServerVariableObject } from './interfaces/open-api-spec.interface';
export declare class DocumentBuilder {
    private readonly logger;
    private readonly document;
    setTitle(title: string): this;
    setDescription(description: string): this;
    setVersion(version: string): this;
    setTermsOfService(termsOfService: string): this;
    setContact(name: string, url: string, email: string): this;
    setLicense(name: string, url: string): this;
    addServer(url: string, description?: string, variables?: Record<string, ServerVariableObject>): this;
    setExternalDoc(description: string, url: string): this;
    setBasePath(path: string): this;
    addTag(name: string, description?: string, externalDocs?: ExternalDocumentationObject): this;
    addSecurity(name: string, options: SecuritySchemeObject): this;
    addSecurityRequirements(name: string | SecurityRequirementObject, requirements?: string[]): this;
    addBearerAuth(options?: SecuritySchemeObject, name?: string): this;
    addOAuth2(options?: SecuritySchemeObject, name?: string): this;
    addApiKey(options?: SecuritySchemeObject, name?: string): this;
    addBasicAuth(options?: SecuritySchemeObject, name?: string): this;
    addCookieAuth(cookieName?: string, options?: SecuritySchemeObject, securityName?: string): this;
    build(): Omit<OpenAPIObject, 'paths'>;
}
