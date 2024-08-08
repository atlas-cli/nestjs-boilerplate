import { production } from './configs/production';
import { bootstrap } from './helpers/bootstrap';

// Execute the infraestructure application
bootstrap({
    production,
});