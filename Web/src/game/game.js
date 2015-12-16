Nemonemo({
	jQuery: $,
	gameContainer: $('#Game'),
	width: 10,
	height : 10,
	gameMode: 'Play', //Create, Modify
	quiz: [] // if Play mode, need this value
});

function Nemonemo(args) {

	var $ = args.jQuery,
		gameContainer = args.gameContainer || $('#Game'),
		width = args.width || (args.size && args.size[0]) || 10,
		height = args.height || (args.size && args.size[1]) || 10,
		gameMode = args.gameMode || 'Play'
		quiz = args.quiz || [];

	/*
	* Model 
	*/
	var Model = function() {
	}

	/*
	* View 
	*/
	var View = function() {
	}

	View.prototype.Initialize = function() {
		gameContainer.empty();
	}

	View.prototype.Draw = function() {
	}

	/*
	* Controller
	*/
	var Controller = function() {
		this.model = model;
		this.view = view;
	}

	Controller.prototype.Start = function() {
		this.view.Initialize();
	}

	Controller.prototype.DoUpdate = function() {
		this.view.Draw(this.model);
	}

	/*
	* Main 
	*/
	var model = new Model();
	var view = new View();
	var controller = new Controller(model, view);

	controller.Start();
}