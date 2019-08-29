/*
*
*
*       Complete the API routing below
*
*
*/

'use strict'

var expect = require('chai').expect
const mongoose = require('mongoose')

const CONNECTION_STRING = process.env.DB

mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true }, function (err, db) {
  if (err) {
    console.log('Database error: ' + err)
  } else {
    console.log('Successful database connection')
  }
})

const IssueSchema = new mongoose.Schema({
  project: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String },
  status_text: { type: String },
  created_on: { type: Date },
  updated_on: { type: Date },
  open: { type: Boolean, required: true }
})

const Issue = mongoose.model('Issue', IssueSchema)

// create new issue
const createIssue = (newIssue) => {
  return new Promise((resolve, reject) => {
    var issueTemp = new Issue({
      project: newIssue.project,
      issue_title: newIssue.issue_title,
      issue_text: newIssue.issue_text,
      created_by: newIssue.created_by,
      assigned_to: newIssue.assigned_to,
      status_text: newIssue.status_text,
      created_on: new Date(),
      updated_on: new Date(),
      open: true
    })
    issueTemp.save((err, data) => {
      if (!err) {
        console.log('Creating issue')
        resolve(data)
      } else {
        console.log('Issue create error')
        reject(err)
      }
    })
  })
}

// return list of all issues in database
const listIssues = (query) => {
  return new Promise((resolve, reject) => {
    Issue.find(query).exec((err, data) => {
      if (!err) {
        console.log('Listing issues')
        resolve(data)
      } else {
        console.log('Issue list error')
        reject(err)
      }
    })
  })
}

// update issue with new data
const updateIssue = (issueId, newData) => {
  return new Promise((resolve, reject) => {
    if (!newData.issue_title && !newData.issue_text && !newData.created_by && !newData.assigned_to && !newData.status_text && !newData.open) {
      resolve('no updated field sent')
    } else {
      Issue.updateOne({ _id: issueId }, newData, (err, issue) => {
        if (!err) {
          resolve('successfully updated')
        } else {
          console.log('Issue update error')
          reject(err)
        }
      })
    }
  })
}

const deleteIssue = (issueId) => {
  return new Promise((resolve, reject) => {
    if (!issueId) {
      resolve('_id error')
    } else {
      Issue.find({ _id: issueId }).deleteOne((err, data) => {
        if (!err) {
          console.log('Deleting task')
          resolve(`deleted ${issueId}`)
        } else {
          console.log('Task delete error')
          reject(err)
        }
      })
    }
  })
}

module.exports = function (app) {
  app.get('/api/issues/:project', function (req, res, next) {
    var query = {}
    if (req.query) query = req.query
    query.project = req.params.project
    listIssues(query)
      .then(data => {
        res.send(data)
      }).catch(err => {
        console.error(err)
        next(err)
      })
  })

    .post('/api/issues/:project', function (req, res, next) {
      var newIssue = {
        project: req.params.project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text
      }
      createIssue(newIssue)
        .then(data => {
          console.log('Created!')
          res.send(data)
        }).catch(err => {
          console.error(err)
          next(err)
        })
    })

    .put('/api/issues/:project', function (req, res, next) {
      var issueId = req.body._id
      var newData = {
        updated_on: new Date()
      }
      if (req.body.issue_title) newData.issue_title = req.body.issue_title
      if (req.body.issue_text) newData.issue_text = req.body.issue_text
      if (req.body.created_by) newData.created_by = req.body.created_by
      if (req.body.assigned_to) newData.assigned_to = req.body.assigned_to
      if (req.body.status_text) newData.status_text = req.body.status_text
      if (req.body.open) newData.open = req.body.open
      updateIssue(issueId, newData)
        .then(data => {
          res.send(data)
          console.log('Updated')
        }).catch(err => {
          res.send(`could not update ${issueId}`)
          console.error(err)
          next(err)
        })
    })

    .delete('/api/issues/:project', function (req, res, next) {
      var issueId = req.body._id
      deleteIssue(issueId)
        .then(data => {
          res.send(data)
          console.log('Deleted')
        }).catch(err => {
          res.send(`could not delete ${issueId}`)
          console.error(err)
          next(err)
        })
    })
}
