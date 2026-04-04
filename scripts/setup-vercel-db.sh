#!/bin/bash

echo "🗄️  Setting up Vercel Postgres Database"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
fi

# Login and link project
echo "🔐 Logging in to Vercel..."
vercel login

echo "🔗 Linking project..."
vercel link

# Pull environment variables
echo "📥 Pulling environment variables..."
vercel env pull .env.production

# Check if POSTGRES_PRISMA_URL exists
if ! grep -q "POSTGRES_PRISMA_URL" .env.production; then
    echo ""
    echo "⚠️  No Postgres database found!"
    echo ""
    echo "Please create a Postgres database in Vercel:"
    echo "1. Go to https://vercel.com/dashboard"
    echo "2. Select your project"
    echo "3. Go to 'Storage' tab"
    echo "4. Click 'Create Database'"
    echo "5. Select 'Postgres'"
    echo "6. Create the database"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Extract database URL
DB_URL=$(grep POSTGRES_PRISMA_URL .env.production | cut -d '=' -f2-)

echo ""
echo "✅ Database found!"
echo ""

# Run migrations
echo "📦 Running migrations on production database..."
DATABASE_URL="$DB_URL" npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "❌ Migration failed!"
    exit 1
fi

echo ""
echo "✅ Migrations complete!"
echo ""

# Ask about seeding
read -p "🌱 Do you want to seed the form with 17 questions? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    DATABASE_URL="$DB_URL" npx tsx prisma/seed-form.ts
    
    if [ $? -ne 0 ]; then
        echo "❌ Seeding failed!"
        exit 1
    fi
    
    echo ""
    echo "✅ Database seeded!"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Commit and push your changes: git push"
echo "2. Vercel will auto-deploy"
echo "3. Update OAuth redirect URIs to include your production URL"
echo "4. Verify email domain in Resend dashboard"
echo ""
