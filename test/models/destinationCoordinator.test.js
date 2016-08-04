import { describe } from 'ava-spec';
import Promises from 'bluebird';
import { loadFixtures, getAllElements } from '../helpers';
import db from '../../src/models';

let userObjects; //eslint-disable-line
let destinationObjects;


describe('Destination Coordinator Model', it => {
    it.before(() =>
        loadFixtures()
            .then(() => getAllElements('User'))
            .then(response => {
                userObjects = response;
            })
            .then(() => getAllElements('Destination'))
            .then(response => {
                destinationObjects = response;
            })
        );


    it('should be able to add several new coordinators for destination', async t => {
        const destObj = destinationObjects[0];
        return await Promises.all([
            db.User.findAll(),
            db.Destination.findOne({
                where: {
                    id: destObj.id
                }
            })
        ])
        .spread((users, destination) => destination.addUsers([1, 2]))
        .then(() => db.Destination.findOne({ where: { id: destObj.id } }))
        .then(dest => dest.countUsers()) //eslint-disable-line
        .then((users) => t.is(users, 2));
    });
});
