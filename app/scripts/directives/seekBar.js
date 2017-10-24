(function() {

    function seekBar($document) {
        var calculatePercent = function(seekBar, event) { //takes in the seekbar *JQ*element itself and where the click event took place
            var offsetX = event.pageX - seekBar.offset().left; //offsetx pixel value from beginning of seekbar
            var seekBarWidth = seekBar.width(); //returns pixel value of element width
            var offsetXPercent = offsetX / seekBarWidth; //divides them to give number between 0and1
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent); //ensure figure between 0and1 (useful for when dragging goes too far - because can drag anywhere on the doccument)
            return offsetXPercent;            
        };
        
        return { //returns an object that describes the directive's behavior to Angular's HTML compiler
            templateUrl: '/templates/directives/seek_bar.html', //when utilisted the directive will load this template
            replace: true, //true=replace directives actual element. false=replace contents within element
            restrict: 'E', //only usable as an element (which given these settings, its entirety will be replaced by above template)
            scope: { }, //creates isolated scope for any properties or methods within the directive (no inheritance from parent controller scope)
            link: function(scope, element, attributes) { //automatically generated on directives element - holds direct every time DOM manipulation logic
                //track value of progress bar
                scope.value = 0;
                scope.max = 100;

                var seekBar = $(element); //the element that the directive is placed on wrapped in JQ object

                //change value to percentage
                var percentString = function() {
                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                    return percent + "%";
                };

                //style the fill element on the DOM using that percentage
                scope.fillStyle = function(){
                    return {width: percentString()}; //must be object like this for ng-style directive which changes the css
                };

                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event); //returns decimal number based on clickevent
                    scope.value = percent * scope.max; //turns decimal number into value
                };

                //when mouse goes down on the thumb listen to mousemove, when mouse goes up, stop listening
                scope.trackThumb = function() {
                    $document.bind("mousemove.thumb", function(event){ //tracks mousemove event
                        var percent = calculatePercent(seekBar, event); //calculates number between 0and1 of where you drag
                        scope.$apply(function(){
                            scope.value = percent * scope.max; //turns decimal into value number which can be used as % in css 
                        });
                    });

                    $document.bind("mouseup.thumb", function(){ //on mouse up event
                        $document.unbind("mousemove.thumb"); //stop tracking mousemove
                        $document.unbind("mouseup.thumb"); //stop listening for mouseup, because only need to listen for that after mouse has gone down
                    });
                };

            }
        };
    }

    
    angular
        .module("blocJams")
        .directive("seekBar",["$document", seekBar]); //name of directive and callback directive definition object DDO
})();