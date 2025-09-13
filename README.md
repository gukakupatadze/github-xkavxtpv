# DataLab Georgia - მონაცემთა აღდგენის სერვისი

საქართველოს წამყვანი მონაცემთა აღდგენის სერვისის ვებსაიტი.

## 🚀 ფუნქციონალი

- **მონაცემთა აღდგენა**: HDD, SSD, RAID, USB, SD ბარათები
- **ფასის კალკულატორი**: ავტომატური ფასის გაანგარიშება
- **საქმის თვალთვალი**: რეალურ დროში სტატუსის მონიტორინგი
- **ადმინისტრაციის პანელი**: კანბან დაფა და ანალიტიკა
- **ორენოვანი მხარდაჭერა**: ქართული/ინგლისური

## 🛠️ ტექნოლოგიები

### Frontend
- **React 19** - UI ბიბლიოთეკა
- **Tailwind CSS** - სტილიზაცია
- **Radix UI** - კომპონენტები
- **Axios** - HTTP კლიენტი
- **React Router** - მარშრუტიზაცია

### Backend
- **FastAPI** - Python ვებ ფრეიმვორკი
- **PostgreSQL** - მონაცემთა ბაზა
- **SQLAlchemy** - ORM
- **Asyncpg** - PostgreSQL დრაივერი
- **Pydantic** - მონაცემთა ვალიდაცია

## 📁 პროექტის სტრუქტურა

```
├── frontend/                 # React აპლიკაცია
│   ├── src/
│   │   ├── components/      # React კომპონენტები
│   │   ├── hooks/          # Custom hooks
│   │   ├── data/           # Mock მონაცემები
│   │   └── lib/            # Utility ფუნქციები
│   └── public/             # სტატიკური ფაილები
├── backend/                 # FastAPI სერვერი
│   ├── routes/             # API endpoints
│   ├── models/             # მონაცემთა მოდელები
│   └── database.py         # მონაცემთა ბაზის კონფიგურაცია
└── schema.sql              # PostgreSQL სქემა
```

## 🚀 გაშვება

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python server.py
```

## 🌐 API Endpoints

- `GET /api/health` - სერვისის სტატუსი
- `POST /api/service-requests/` - სერვისის მოთხოვნა
- `GET /api/service-requests/{case_id}` - საქმის თვალთვალი
- `POST /api/contact/` - კონტაქტის შეტყობინება
- `POST /api/price-estimate/` - ფასის გაანგარიშება
- `GET /api/testimonials/` - მომხმარებელთა გამოხმაურება

## 📊 ადმინისტრაციის პანელი

ხელმისაწვდომია `/admin` მისამართზე:
- 📋 კანბან დაფა - საქმეების ვიზუალური მართვა
- 📈 ანალიტიკა - დეტალური სტატისტიკა
- 💬 შეტყობინებები - კონტაქტის ფორმების მართვა
- 📨 კომუნიკაცია - ავტომატიზებული შეტყობინებები

## 🔧 კონფიგურაცია

### Environment Variables

**Frontend (.env)**:
```
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

**Backend (.env)**:
```
POSTGRES_URL=postgresql+asyncpg://user:pass@host:port/database
CORS_ORIGINS=http://localhost:3000,https://your-frontend-url.com
```

## 📝 ლიცენზია

© 2024 DataLab Georgia. ყველა უფლება დაცულია.