import { developerTemplates } from './developer'
import { modelTemplates } from './model'
import { psychiatristTemplates } from './psychiatrist'

// Every template is a portfolio; one folder per profession
export const portfolioTemplates = [...modelTemplates, ...psychiatristTemplates, ...developerTemplates]
