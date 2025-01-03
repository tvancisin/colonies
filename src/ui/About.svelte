<div id="people">
  <h3 style="position: absolute; left: 10px; top: 0px">About</h3>
  <div id="about">
    <div class="content">
      <img src="./reports_2.png" alt="Report Image" class="float-image" />
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
      <p>
        In St Andrews, we tried a different and much broader approach. We looked
        at all our colonial/imperial connections including North America,
        Caribbean, Indian subcontinent, Australasia, South & East Asia and
        Africa. In addition, we explored not only the financial, but also
        social, cultural, and intellectual links between our students/alumni and
        the colonies. Lastly, we used interactive visual interfaces as a means
        to explore/look at our data from new perspectives and present it in an
        engaging way.

        <!-- The existence of a digital version of the Biographical
        Register of the University of St Andrews, containing records from the
        University’s matriculation registers from 1579-1897, gives us the
        opportunity to generate some high-level statistics on the student body.
        Analysis of the Biographical Register has enabled us to identify some of
        the students who were born in the colonies (though we do not know where
        they were brought up). These figures offer some insight into the
        diversity (or not) of experiences and attitudes that would have been
        present in the student community. They also point to another way in
        which the University benefited financially from colonialism, via the
        fees paid by the parents of students from (or associated with) the
        colonies. We have also been able to identify some of the alumni who
        later spent time in the colonies, for personal or professional reasons.
        These figures reveal the ways in which St Andrews helped educate people
        who became part of the military or administrative systems underpinning
        empire, or who used the opportunities offered by empire to find outlets
        for their professional or business skills. -->
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

  .float-image {
    width: 70%; /* 80% width of the parent */
    margin: 0 auto; /* Center horizontally */
    margin-top: 50px;
    display: block; /* Ensure it's treated as a block element */
    border-radius: 2px;
    /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.576); */
    position: relative; /* Allow centering with flex or other techniques */
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
</style>
