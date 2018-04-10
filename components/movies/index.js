export function render(movies, container, openAccordions) {
	let html = '';

	Object.keys(movies).forEach((year) => {
    html += `<h3>${year}</h3>`;

    for (let month in movies[year]) {

      for (let day in movies[year][month]) {

        for (let i=0; i<movies[year][month][day].length; i++) {
          html += `<div class="database-entry movie" data-id="${movies[year][month][day][i]._id}">
                     <div class="accordion`;

          if (openAccordions.indexOf(movies[year][month][day][i]._id) != -1) {
            html += ` make-room`;
          }

          html += `" data-id="${movies[year][month][day][i]._id}"><span class="database-title">${movies[year][month][day][i].title}</span></div>
                     <div class="title-edit-right`;

          if (openAccordions.indexOf(movies[year][month][day][i]._id) === -1) {
            html += ` retracted`;
          }

          html += `"><button class="edit-title-button" data-id="${movies[year][month][day][i]._id}"><span class="edit-title-text">Edit</span></button></div>
                     <div class="panel`;

          if (openAccordions.indexOf(movies[year][month][day][i]._id) === -1) {
            html += ` retracted`;
          }

          html += `" data-id="${movies[year][month][day][i]._id}">
                       <div class="database-date" data-id="${movies[year][month][day][i]._id}">
                         watched on `;

        if (month === '1')
          html += `January`;
        else if (month === '2')
          html += `February`;
        else if (month === '3')
          html += `March`;
        else if (month === '4')
          html += `April`;
        else if (month === '5')
          html += `May`;
        else if (month === '6')
          html += `June`;
        else if (month === '7')
          html += `July`;
        else if (month === '8')
          html += `August`;
        else if (month === '9')
          html += `September`;
        else if (month === '10')
          html += `October`;
        else if (month === '11')
          html += `November`;
        else if (month === '12')
          html += `December`;

        html += ` ${movies[year][month][day][i].date.day}, ${movies[year][month][day][i].date.year}
                         <span class="edit-date"><button class="edit-date-button" data-id="${movies[year][month][day][i]._id}"><span class="edit-date-text">Edit</span></button><span class="edit-date-error"></span></span>
                       </div>`;

        html += `<div class="database-starrating" data-id="${movies[year][month][day][i]._id}">`;

        html += renderOriginalStars(movies[year][month][day][i].starRating);

        html += `</div>`;

          html += `<div class="database-review big" data-id="${movies[year][month][day][i]._id}">
                     <div class="read-review" data-id="${movies[year][month][day][i]._id}">${movies[year][month][day][i].review}</div>
                     <div class="edit-review" data-id="${movies[year][month][day][i]._id}"><button type="submit" class="edit-review-button">Edit Your Review</button></div>
                   </div>
                   <div class="database-delete">
                     <button type="submit" class="delete-movie-button" data-id="${movies[year][month][day][i]._id}">Delete This Movie</button>
                   </div>
                  </div>
                </div>`;
        }
      }
    }
  });

  if (html === '')
    html = `<p><br />You have no movies! Please add some!</p>`;

	container.html(`<div class="database-add">
                   <button type="add-movie-button" class="add-movie-button">Add A Movie</button>
                  </div>` + html);
}





function renderOriginalStars(originalRating) {
  let html = '';
  let i;

  for (i = 0; i < 5; i++) {
    html += `<span class="star`;

    if (i < originalRating)
      html += ` star-on`;
    else
      html += ` star-off`;

    if (i === (originalRating-1))
      html += ` star-original`;

    html += `" data-id="${i}">*</span>`;
  }
  return html;
}





export function renderStars(container, currentStar) {
  container.parent('div').children('.star').each(function() {
    if ($(this).attr('data-id') <= currentStar) {
      $(this).removeClass('star-off');
      $(this).addClass('star-on');
    }
    else {
      $(this).removeClass('star-on');
      $(this).addClass('star-off');
    }
  });
}