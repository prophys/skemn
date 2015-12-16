Nemonemo({
	jQuery: $,
	gameContainer: $('#Game'),
	width: 10,
	height : 10,
	gameMode: 'Play', //Create, Modify
	quiz: [] // if Play mode, need this value
});

function Nemonemo(args) {

	/*
	* Initialize variables
	*/
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
		var i, j;

		gameContainer.empty();
		var table = $('<table></table>');
		var horizonView = '<tr>';
		for(i=0; i<width; ++i) {
			horizonView += '<td class="h' + i + '"></td>';
		}
		horizonView += '</td>';
		table.append($(horizonView));
		gameContainer.html(table);
	}

	/*
	* Controller
	*/
	var Controller = function(model, view) {
		this.model = model;
		this.view = view;
	}

	Controller.prototype.Start = function() {
		this.view.Initialize();
	}

	/*
	* Main 
	*/
	var model = new Model();
	var view = new View();
	var controller = new Controller(model, view);

	controller.Start();
}