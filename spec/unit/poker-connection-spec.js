var pokerConnection = require('../../lib/poker-connection');

// TODO: remove asap. This is ugly
broadcastUsers = function() {};
broadcastCards = function() {};

describe('poker-connection', function() {
    it('should be initialized', function() {
        var currentUsers = [1,2,3];
        var carddisplay = [8,13,20];
        var connectionHandler = pokerConnection.getNewHandler();

        connectionHandler.init(currentUsers, carddisplay);

        expect(connectionHandler.pokerData).toEqual({
            "users": currentUsers,
            "carddisplay": carddisplay
        });
    });

    it('should set a connection', function() {
        var connectionMock = {
            on: function(type, callback) {}
        };
        spyOn(connectionMock, 'on');

        var connectionHandler = pokerConnection.getNewHandler();
        connectionHandler.init(null, null);
        connectionHandler.setConnection(connectionMock);

        expect(connectionMock.on).toHaveBeenCalledWith('message', jasmine.any(Function));
        expect(connectionMock.on).toHaveBeenCalledWith('close', jasmine.any(Function));
    });

    it('should remove all connection listeners when connection is closed', function() {
        var connectionMock = {
            on: function() {},
            removeAllListeners: function() {}
        };
        spyOn(connectionMock, 'removeAllListeners');

        var connectionHandler = pokerConnection.getNewHandler();
        connectionHandler.init(null, null);
        connectionHandler.setConnection(connectionMock);

        connectionHandler.onclose();
        expect(connectionMock.removeAllListeners).toHaveBeenCalled();
    });

    it('should remove the user and all listeners when connection is closed', function() {
        var connectionMock = {
            on: function() {},
            removeAllListeners: function() {}
        };
        spyOn(connectionMock, 'on');

        var usersMock = {
            remove: function() {}
        };
        spyOn(usersMock, 'remove');

        var carddisplayMock = {
            removeCard: function() {}
        };
        spyOn(carddisplayMock, 'removeCard');

        var userIdMock = 'foobar';

        var connectionHandler = pokerConnection.getNewHandler();
        connectionHandler.init(usersMock, carddisplayMock);
        connectionHandler.setConnection(connectionMock);
        connectionHandler.user = {
            id: userIdMock
        };

        connectionHandler.onclose();

        expect(usersMock.remove).toHaveBeenCalledWith(userIdMock);
        expect(carddisplayMock.removeCard).toHaveBeenCalledWith(userIdMock);
        expect(connectionMock.on).toHaveBeenCalledWith('message', jasmine.any(Function));
        expect(connectionMock.on).toHaveBeenCalledWith('close', jasmine.any(Function));
    });
});