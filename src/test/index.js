/* eslint-disable no-console */
/**
 * Unit tests for CogniCity Twitter DM Lambda
 * @file Runs unit tests for CogniCity Twitter DM Lambda
 *
 * Tomas Holderness June 2017
 */

// Unit tests
import testCards from './testLibCards.js';
import testTwitter from './testLibTwitter.js';
import testReceiveGet from './testReceiveGet.js';

testCards();
testTwitter();
testReceiveGet();
