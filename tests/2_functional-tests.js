/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http')
var chai = require('chai')
var assert = chai.assert
var server = require('../server')

chai.use(chaiHttp)

suite('Functional Tests', function() {
  var testId
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          testId = res.body._id
          assert.equal(res.status, 200)
          assert.equal(res.type, 'application/json', "Response should be json")
          assert.equal(res.body.issue_title, 'Title', 'res.body.issue_title should be "Title"')
          assert.equal(res.body.issue_text, 'text', 'res.body.issue_text should be "text"' )
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in', 'res.body.created_by should be "Functional Test - Every field filled in"' )
          assert.equal(res.body.assigned_to, 'Chai and Mocha', 'res.body.assigned_to should be "Chai and Mocha"' )
          assert.equal(res.body.status_text, 'In QA', 'res.body.status_text should be "In QA"' )
         
          //fill me in too!
          
          done()
        })
      })
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.type, 'application/json', "Response should be json")
          assert.equal(res.body.issue_title, 'Title', 'res.body.issue_title should be "Title"')
          assert.equal(res.body.issue_text, 'text', 'res.body.issue_text should be "text"' )
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in', 'res.body.created_by should be "Functional Test - Every field filled in"' )
          assert.equal(res.body.assigned_to, 'Chai and Mocha', 'res.body.assigned_to should be "Chai and Mocha"' )
          assert.equal(res.body.status_text, 'In QA', 'res.body.status_text should be "In QA"' )
          
          done()
        })
      })
      
      test('Missing required fields', function(done) {
                chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          created_by: 'Functional Test - Missing required fields',
        })
        .end(function(err, res){
          assert.instanceOf(res.error, Error, 'Res has an error attached')
          assert.equal(res.status, 500)
          assert.equal(res.type, 'text/plain', "Response should be text")

          
          done()
        })
      })
      
    })
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: testId
        })
        .end(function(err, res){
          assert.equal(res.text, 'no updated field sent', "Response should be 'no updated field sent'")
          assert.equal(res.status, 200)
          assert.equal(res.type, 'text/html', "Response should be text")
          done()
        })
      })
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: testId,  
          issue_title: 'newTitle'
        })
        .end(function(err, res){
          assert.equal(res.text, 'successfully updated', 'res.text should be "successfully updated"')
          assert.equal(res.status, 200)
          assert.equal(res.type, 'text/html', "Response should be text")
          done()
        })
      })
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: testId,  
          issue_title: 'newerTitle',
          issue_text: 'newtext'
        })
        .end(function(err, res){
          assert.equal(res.text, 'successfully updated', 'res.text should be "successfully updated"')
          assert.equal(res.status, 200)
          assert.equal(res.type, 'text/html', "Response should be text")
          done()
        })
      })
      
    })
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'issue_title')
          assert.property(res.body[0], 'issue_text')
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'updated_on')
          assert.property(res.body[0], 'created_by')
          assert.property(res.body[0], 'assigned_to')
          assert.property(res.body[0], 'open')
          assert.property(res.body[0], 'status_text')
          assert.property(res.body[0], '_id')
          done()
        })
      })
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
        })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.propertyVal(res.body[0], 'created_by', 'Functional Test - Every field filled in')
          assert.propertyVal(res.body[0], 'assigned_to', 'Chai and Mocha')
          done()
        })
      })
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'issue_title')
          assert.property(res.body[0], 'issue_text')
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'updated_on')
          assert.property(res.body[0], 'created_by')
          assert.property(res.body[0], 'assigned_to')
          assert.property(res.body[0], 'open')
          assert.property(res.body[0], 'status_text')
          assert.property(res.body[0], '_id')
          done()
        })
      })
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
        })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.propertyVal(res.body[0], 'created_by', 'Functional Test - Every field filled in')
          assert.propertyVal(res.body[0], 'assigned_to', 'Chai and Mocha')
          done()
        })
      })
      
    })
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.text, '_id error', "Response should be '_id error'")
          assert.equal(res.status, 200)
          assert.equal(res.type, 'text/html', "Response should be text")
          done()
        })
      })
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({ _id: testId })
        .end(function(err, res){
          assert.equal(res.text, `deleted ${testId}`, "Response should be `deleted ${testId}`")
          assert.equal(res.status, 200)
          assert.equal(res.type, 'text/html', "Response should be text")
          done()
        })
      })
      
    })

})
