# lilt 2 - Lightweight Interactive Learning Tool

**Now using Markdown and [@lazarv/react-server](https://react-server.dev)!**

## What is lilt?

`lilt` is a tool to allow students to actively participate in learning sessions by means of interactive exercises. When tutors are delivering learning material via a lecture or a talk, there is always a question as to whether the students are actually understanding the content. `lilt` allows tutors to check students' understanding by integrating lecture material with interactive exercises which students can answer in class. The tutor can then view submitted answers and the submitted answers can be discussed in class, to address common misunderstandings.

`lilt` also allows tutors to hide sections of the notes until particular exercises have been answered. This allows students to think through problems themselves and suggest their own ideas before the problem is discussed through the notes.

With `lilt` 2, tutors now write code in Markdown with custom extensions to support exercises and hidden content.

## What lilt is not

First of all, a quick word on what `lilt` is not. It is not, and does not aim to be, a full Virtual Learning Environment (VLE). Students do not provide their personal details at all, providing a private and anonymous environment. `lilt` does not aim to assess students over the period of a whole module, but just aims to check their understanding of the current topic.

It's also geared at tutors who are happy using Markdown to write their notes. It does not yet support PowerPoint slides for example and may not for some considerable time.

## How to setup a lilt server

As `lilt` servers are expected to be small-scale, servicing just one class at a time, SQLite is used. An SQL setup file `setupdb.sql` is provided. Import this with the `sqlite3` client, for example:

```
sqlite3 < setupdb.sql
```

### Install dependencies and build

`lilt` uses [@lazarv/react-server](https://react-server.dev) as its web development framework. You should install the package management tool  [pnpm](https://pnpm.io).

Once installed do:

```
pnpm install
```

Then build:

```
pnpm react-server build
```

To start:

```
pnpm react-server start
```

`lilt` will run on port 3002 by default.
 
### Setup an admin user

A `lilt` server should have one or more admin users. These are setup by means of a utility script in `server/utils`, `addAdmin.mjs`. Run this, to add an admin user to the database. 


### Write your notes

#### Where to save your notes

- Notes should be placed in the directory specified by the `RESOURCES` environment variable (you can, for example, place this in a `.env` file). 
- Within this directory you should create separate subdirectories for each module, using the module code you specify when adding a module as an admin user as the directory name.
- Then, you create numbered directories within the module directory corresponding to each topic, and save your HTML for a given module as `index.html` within the appropriate module directory.

#### How to write your notes

Explanation of how to use custom Markdown extensions to embed exercises and create hidden content will appear here.

### Setup exercises

When the server is running you can access the admin section with

```
http://localhost:3002/admin
```

A number of options are available to setup modules, topics and exercises. These will be described in more detail in a later revision of this `README`.

## Users/students

On the main page, students can signup for a random and anonymous 6-digit **user code**. This identifies them as a user and allows `lilt` to determine if they have answered exercises and whether the tutor has authorised their answers.

These user codes are intended to be only usable for one week (i.e they are for the current topic only); in the `utils` directory within `server` there is a cleanup script which will delete answers and users older than a week.

Again the main interface will be described in a later revision of this `README`.
