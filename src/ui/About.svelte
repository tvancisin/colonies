<div id="people">
  <h3 style="position: absolute; left: 10px; top: 0px">About</h3>
  <div id="about">
    <div class="content">
      <p>
        Investigations into universities' historical connections to enslavement
        and the slave trade began in the USA – at Brown University in 2005 – and
        by 2014, over 100 universities in North America and Europe had formed
        the 'Universities Studying Slavery Consortium'. In the UK and Ireland,
        at least 17 universities have begun similar studies; and, at the time of
        writing, at least nine have published some form of report, starting with
        Glasgow in 2019. However, the reports published so far usually
        investigate the ways in which the university benefited financially from
        enslavement and/or colonialism. Even though some of the reports have
        also sought to identify students or alumni with possible connections to
        enslavement and/or colonialism, they discuss just a handful of selected
        individuals and focus predominantly on the Transatlantic trade.
      </p>
      <figure class="image-container">
        <img src="./colonies.png" alt="Report Image" class="float-image" />
        <figcaption class="image-caption">
          UK universities studying their colonial past. White font
          and a page icon indicate published reports. Visualization
          icon indicates using information visulization techniques as a research method.
        </figcaption>
      </figure>
      <p>
        In St Andrews, we tried a different and much broader approach. We looked
        at all our colonial/imperial connections including North America,
        Caribbean, Indian subcontinent, Australasia, South & East Asia and
        Africa. In addition, we explored not only the financial, but also
        social, cultural, and intellectual links between our students/alumni and
        the colonies. Lastly, we used interactive visual interfaces as a means
        to explore/look at our data from new perspectives and present it in an
        engaging way.
      </p>
    </div>
  </div>
</div>

<style>
  #people {
    position: relative;
    background-color: #003847;
    width: 100%;
  }

  h3 {
    color: white;
    font-weight: 700;
  }

  .content {
    color: white;
    line-height: 1.5;
  }

  .image-container {
    width: 70%; /* Match the image width */
    margin: 50px auto; /* Center the figure element */
    text-align: center; /* Center the caption */
  }

  .float-image {
    width: 100%; /* Make image fill the container */
    display: block;
    border-radius: 2px;
  }

  .image-caption {
    font-size: 13px;
    color: gray;
    margin-top: 8px;
    line-height: 1;
    font-style: italic;
  }

  #about {
    position: relative;
    padding: 20px;
    padding-top: 30px;
    padding-bottom: 50px;
    width: 75%;
    margin: auto;
    display: flex; /* Enable flexbox for centering */
    flex-direction: column; /* Ensure content stacks vertically */
    align-items: center; /* Center horizontally */
    justify-content: center; /* Center vertically */
    min-height: 100vh; /* Optional: Ensure the container fills the viewport */
  }

  @media (max-width: 768px) {
    .float-image {
      width: 100%; /* Full width for smaller screens */
    }
  }

  p {
    text-indent: 20px;
    font-size: 14px;
    line-height: 1.3;
  }
</style>
