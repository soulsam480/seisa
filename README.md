### Seisa
> Seisa means scrutiny in Japanese. Keep **`scrutiny`** over your finances.

### Why did i build this?
- If you're not from india, we do a lot, like a lot of daily expenses digitally through UPI.
- I like to spend, but I also like to know how and where I spend.
- Right now I keep track of finances or it's automatically done via [axio](https://axio.co.in/).
- TBH, this is one of the best written software I've ever used. It's all automatic and works quite well.
- And there is enough flexibility to manage transactions. Like we can change date, categorize, add notes, etc.
- But it's a little out of context, i.e. because it's automatic, transaction descriptions and meta info is not always accurate.
- And because it's **"AUTOMATIC"**, I don't want to go and change tracked transactions. I mean that defeats the whole purpose right ?
- Then, If I'm going to track and put info by myself, why not make the whole process manual.
- But I also don't want to do it in a spreadsheet. That's too much work.
- So I thought, why not build a simple ledger, that has tailored UI to commit expenses fast.

### What do I expect from the app ?
- Privacy and Speed, The app should store all data in my device. And it should open/close fast.
- Simple, I don't want BS. Like It should be one time setup and then just commit expenses.
- I want to be able to commit expenses fast, like really fast. I mean I open it, I add expense, short note and that's it.
- I also want a place to analyze my expenses. Like how much I spent on food, travel, etc. charts, graphs, etc.
- I want to be able to export my data, like in CSV or something.
- instead of putting proper meta, I should have tags, where I can choose some tags and commit.
- I may want to sync data across devices, but that's not a priority. Axio doesn't do it, and I'm fine with it.
- I should be able to see monthly allowance. Let's say I choose 30k monthly. I want to see how much I've spent and how much is left.
- I should be able to see how much I've spent on a particular day, week, month, year, etc.
- There should be all shorts of views, e.g. how much spent on a tag, how much spent on a tag in a month, etc.

### High level design
- App has 4 basic constructs. Check [Schema](./api/src/schema.ts) for more details.
  - **Account**
  - **Income**
  - **Expense**
  - **Transaction**
- When users onboard
  - Setup account
  - Setup income
  - Setup expense
- Once all setup, user can start committing transactions

For more details see
- [Excalidraw board](./seisa.excalidraw)
- [Draw.io board](./system.drawio)

### High level impl.
- Data
  - Data is stored as a SQLite3 DB in user's device.
  - It uses something called [Origin Private File System (OPFS)](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) to store the DB.
  - The thing about OPFS is it's not exposed to user. i.e. you can't modify it from devtools.
  - This way data never leaves user's device.
- Data handling
  - Data is queried and mutated via [kysely](https://kysely.dev/)
- UI
  - [Vue](https://vuejs.org/) is my first love. It's simple and fast.
  - All data that comes from DB is stored in a massive reactive store. I tried to follow [Mobx store pattern](https://mobx.js.org/defining-data-stores.html).
  - The store is deep reactive. So this way each data point or object can be expressed via a model. Then updating the model will update all of it's references.
- Distribution
  - Bundled with [Vite](https://vitejs.dev/).
  - App is a PWA. So it can be installed on any device. and it's offline first.
  - You literally just need to be online to get app updates. that's it.

For more details
- [API, it's not exactly an API server but more like a data store](./api/src/client.ts)
- [How data is handled in UI](./app/src/state)

### Tech decisions

- Why so complicated data setup? A normal LocalStorage based setup would've been enough.
  - The issue with LocalStorage or IndexedDB is that it's open. i.e. you can modify it from devtools.
  - Also JSON based data is faster to read but harder to query, modify and put relations.
  - i.e. with a relational DB, you can filter with various conditions, you can join tables, etc. much easily with a good query builder. see Kysely.
  - Also, I wanted to try out OPFS. It's a new thing and I wanted to see how it works.
