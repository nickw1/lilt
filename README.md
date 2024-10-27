# lilt - Lightweight Interactive Learning Tool

## What is lilt?

`lilt` is a tool to allow students to actively participate in learning sessions by means of interactive exercises. When tutors are delivering learning material via a lecture or a talk, there is always a question as to whether the students are actually understanding the content. `lilt` allows tutors to check students' understanding by integrating lecture material with interactive exercises which students can answer in class. The tutor can then view submitted answers and the submitted answers can be discussed in class, to address common misunderstandings.

`lilt` also allows tutors to hide sections of the notes until particular exercises have been answered. This allows students to think through problems themselves and suggest their own ideas before the problem is discussed through the notes.

## What lilt is not

First of all, a quick word on what `lilt` is not. It is not, and does not aim to be, a full Virtual Learning Environment (VLE). Students do not provide their personal details at all, providing a private and anonymous environment. `lilt` does not aim to assess students over the period of a whole module, but just aims to check their understanding of the current topic.

It's also geared at tutors who are happy using HTML (and Markdown, though support for the latter is not yet implemented) to write their notes. Notes are expected to be provided in plain HTML, or in due course, in Markdown; it does not yet support PowerPoint slides for example and may not for some considerable time.

## What lilt can do

`lilt` can, however, store full module notes as a series of HTML pages. These can be simply static HTML pages, or can include interactive exercises.

## How to setup a lilt server

As `lilt` servers are expected to be small-scale, servicing just one class at a time, SQLite is used. An SQL setup file `setupdb.sql` is provided. Import this with the `sqlite3` client, for example:

```
sqlite3 < setupdb.sql
```

### Install dependencies and build

`lilt` uses Node, Express, React and Vite. First install the dependencies:

```
npm install
```

Then build:

```
npm run build
```

To start:

```
npm start
```

`lilt` will run on port 3002 by default.
 
### Setup an admin user

A `lilt` server should have one or more admin users. These are setup by means of a utility script in `server/utils`, `addAdmin.mjs`. Run this, to add an admin user to the database. 


### Write your notes

With `lilt` you just write your notes in plain old HTML5, though it is planned to add Markdown support. You break the page down into a series of `<div>`s and label them with appropriate classes to determine whether the content should be public, an exercise, or protected. Protected content is content which is only visible when a particular exercise has been answered and discussed, allowing students to try to think through questions themselves without "cheating" by reading later content!

Your notes MUST be well-formed HTML, if they are not, `lilt` may fail to render them properly. Before you test your pages, make sure you run them through the W3C HTML validator and fix all errors.

Your notes must have a `<main>` element which contains your content.

Inside your `<main>` you should create a series of `<div>`s each of which should have one of the following classes:

- `content-public` : `<div>`s with this class will be fully publicly visible.

- `content-exercise` : this `div` will contain an exercise. It must take an attribute `data-id` which should be set equal to the exercise's number. It can contain arbitrary content, but **must** contain a child `<div>` with a class of `questions`. This will contain the exercise's questions. These are setup via the admin interface - see below. 

- `content-protected`: `<div>`s with this class are **protected**. This means that they can only be viewed if a particular exercise has been completed, and the tutor/admin has authorised students' answers. This is specified via the `data-depends` attribute, which should be set equal to the number of the exercise which must be completed to view this protected section. You can similarly also add a `data-depends` attribute to `content-exercise` `<div>`s, to only show a later exercise when an earlier one has been completed.

Here is an example HTML document:
```html
<!DOCTYPE html>
<html lang="en">

<head>
<title>Example Notes</title>
<meta charset="utf-8">
</head>

<body>
<main>

<div class='content-public'>
This is some public content. It will always be available to view.
</div>

<div class='content-exercise' data-id='1'>
<p>This is an introductory paragraph for the exercise.</p>
<div class='questions'></div> <!-- questions will be automatically inserted here -->
</div>

<div class='content-protected' data-depends='1'>
This is protected content. It will not be visible to a given student until they have answered Exercise 1 and had their answers authorised by the tutor.
</div>

<div class='content-public'>
This is some more public content.
</div>

<div class='content-exercise' data-id='2' data-depends='1'>
<p>This is a second exercise. It will not be visible until the student has completed Exercise 1 and had their answers authorised by the tutor.</p>
<div class='questions'></div>
</div>

<div class='content-protected' data-depends='2'>
This protected content will not be visible until the student has answered Exercise 2 and had their answers authorised by the tutor.
</div>

</main>
</body>

</html>
```

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
