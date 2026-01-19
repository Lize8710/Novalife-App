# Novalife-App

A patient/character management application with medical history tracking and trusted person contacts.

## Features

- **Patient Management**: Create and manage patient profiles
- **Medical Tracking**: Blood type, medical history, primary doctor
- **Trusted Contacts**: Manage emergency contacts and trusted persons
- **Media Support**: Attach documents, images, and links
- **Security**: Row-level security for data protection

## Project Structure

```
Novalife-App/
├── Entities/
│   └── Character.json     # Patient/Character schema
├── src/                   # Source code
├── tests/                 # Unit tests
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/Novalife-App.git
cd Novalife-App
npm install
```

### Usage

```bash
npm start
```

## Character Schema

The Character entity represents a patient with:
- Basic info (name, birth date, nationality)
- Contact details (phone, address)
- Medical data (blood type, doctor, history)
- Trusted persons array
- Attachments (documents, images, links)

## License

MIT License - see LICENSE file for details